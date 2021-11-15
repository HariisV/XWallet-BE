const helper = require('@src/helpers/wrapper');
const transactionModel = require('@modules/transaction/transactionModel');
const userModel = require('@modules/user/userModel');
const midtrans = require('@src/helpers/midtrans');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  postTransaction: async (req, res) => {
    try {
      const id = uuidv4();
      const userId = req.decodeToken.id;
      const { amount } = req.body;

      const setData = {
        id,
        userId,
        amount,
        status: 'pending',
      };

      await transactionModel.postTopup(setData);

      const topupData = {
        id,
        amount,
      };
      const resultMidtrans = await midtrans.post(topupData);
      return helper.response(res, 200, 'Please pay topup', {
        redirectUrl: resultMidtrans,
      });
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  postMidtransNotif: async (req, res) => {
    try {
      const resultMidtrans = await midtrans.notif(req.body);
      console.log(resultMidtrans);
      const { orderId, transactionStatus, fraudStatus } = resultMidtrans;
      const getData = await transactionModel.getDataTopup(orderId);
      console.log(getData);
      if (getData.length < 1) {
        return helper.response(res, 404, 'Data not found', null);
      }

      const { id, balance, topupAmount } = getData[0];
      if (transactionStatus === 'capture') {
        if (fraudStatus === 'challenge') {
          await transactionModel.updateStatusTopup(
            { status: 'failed', updatedAt: new Date() },
            orderId
          );
        } else if (fraudStatus === 'accept') {
          await transactionModel.updateStatusTopup(
            { status: 'success', updatedAt: new Date() },
            orderId
          );
          await transactionModel.updateAmountUser(
            { balance: parseInt(balance) + parseInt(topupAmount), updatedAt: new Date() },
            id
          );
        }
      } else if (transactionStatus === 'settlement') {
        await transactionModel.updateStatusTopup(
          { status: 'success', updatedAt: new Date() },
          orderId
        );
        await transactionModel.updateAmountUser(
          { balance: parseInt(balance) + parseInt(topupAmount), updatedAt: new Date() },
          id
        );
      } else if (transactionStatus === 'deny') {
        await transactionModel.updateStatusTopup(
          { status: 'failed', updatedAt: new Date() },
          orderId
        );
      } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
        await transactionModel.updateStatusTopup(
          { status: 'failed', updatedAt: new Date() },
          orderId
        );
      } else if (transactionStatus === 'pending') {
        await transactionModel.updateStatusTopup(
          { status: 'failed', updatedAt: new Date() },
          orderId
        );
      }
      return helper.response(res, 200, 'Success', null);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  transferTransaction: async (req, res) => {
    try {
      const id = uuidv4();
      const senderId = req.decodeToken.id;
      let { receiverId, amount, notes } = req.body;
      amount = Number(amount);
      if (!amount || amount <= 1000) {
        return helper.response(res, 400, 'Please input amount > 1000 type of number', null);
      }
      if (senderId === receiverId) {
        return helper.response(res, 400, 'Cannot transfer to personal account', null);
      }
      const dataSender = await userModel.getDataConditions({ id: senderId });
      const dataReceiver = await userModel.getDataConditions({ id: receiverId });
      if (dataSender.length < 1) {
        return helper.response(res, 404, 'Id user sender not found', null);
      }
      if (dataReceiver.length < 1) {
        return helper.response(res, 404, 'Id user receiver not found', null);
      }
      if (dataSender[0].balance < amount) {
        return helper.response(res, 400, 'Not enough balance', null);
      }

      const setData = {
        id,
        senderId,
        receiverId,
        amount,
        notes,
      };

      const result = await transactionModel.addTransferHistory(setData);

      // PROCESS ADD BALANCE TO SENDER AND RECEIVER
      const balanceSender = dataSender[0].balance - amount;
      const balanceReceiver = dataReceiver[0].balance + amount;
      await transactionModel.updateAmountUser(
        { balance: balanceSender, updatedAt: new Date() },
        senderId
      );
      await transactionModel.updateAmountUser(
        { balance: balanceReceiver, updatedAt: new Date() },
        receiverId
      );
      // END PROCESS ADD BALANCE TO SENDER AND RECEIVER

      await transactionModel.updateTransferHistory(
        { status: 'success', updatedAt: new Date() },
        result.id
      );

      return helper.response(res, 200, 'Success transfer', { ...result, status: 'success' });
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  historyTransaction: async (req, res) => {
    try {
      const { id } = req.decodeToken;
      let { page, limit, filter } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      filter = filter ? filter.toUpperCase() : 'YEAR';
      const listFilter = ['WEEK', 'MONTH', 'YEAR'];
      if (!listFilter.includes(filter)) {
        return helper.response(res, 400, 'Filter tidak tersedia', null);
      }

      const result = await transactionModel.getHistoryTransaction(id, filter);

      let [topup, accept, send] = result;
      topup = topup.map((item) => {
        return { ...item, fullName: `${item.firstName} ${item.lastName}`, type: 'topup' };
      });
      accept = accept.map((item) => {
        return { ...item, fullName: `${item.firstName} ${item.lastName}`, type: 'accept' };
      });
      send = send.map((item) => {
        return { ...item, fullName: `${item.firstName} ${item.lastName}`, type: 'send' };
      });

      let newResult = [...topup, ...accept, ...send];
      newResult = newResult.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return -1;
        }
        if (a.createdAt > b.createdAt) {
          return 1;
        }
        return 0;
      });

      const totalData = newResult.length;
      const totalPage = Math.ceil(totalData / limit);
      const offset = page * limit - limit;
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      return helper.response(
        res,
        200,
        'Success Get Data',
        newResult.slice(offset, offset + limit),
        pageInfo
      );
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
};
