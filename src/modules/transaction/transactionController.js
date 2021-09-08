const helper = require('@src/helpers/wrapper');
const transactionModel = require('@modules/transaction/transactionModel');
const midtrans = require('@src/helpers/midtrans');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  postTransaction: async (req, res) => {
    try {
      const id = uuidv4();
      const { userId, amount } = req.body;

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
      return helper.response(res, 200, 'Success TopUp Please Confirm ...', {
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
      const { orderId, transactionStatus, fraudStatus } = resultMidtrans;
      const getData = await transactionModel.getDataTopup(orderId);

      if (getData.length < 1) {
        return helper.response(res, 404, 'Data not found', null);
      }

      const { id, amount, topupAmount } = getData[0];
      if (transactionStatus == 'capture') {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == 'challenge') {
          await transactionModel.updateStatusTopup(
            { status: 'failed', updatedAt: new Date() },
            orderId
          );
          // TODO set transaction status on your databaase to 'challenge'
        } else if (fraudStatus == 'accept') {
          await transactionModel.updateStatusTopup(
            { status: 'success', updatedAt: new Date() },
            orderId
          );
          await transactionModel.updateAmountUser(
            { amount: parseInt(amount) + parseInt(topupAmount), updatedAt: new Date() },
            id
          );
          // TODO set transaction status on your databaase to 'success'
          // [1] MENJALANKAN MODEL UNTUK GET DATA DARI TABLE BALANCE SUPAYA MENDAPATKAN USERID & TOPUPAMOUNT BERDASARKAN TOPUPID(ORDERID)
          // [2] MENJALANKAN MODEL UNTUK MENGUPDATE STATUS TOPUP BERDASARKAN TOPUPID(ORDERID)
          // [3] MENJALANKAN MODEL UNTUK MENGUPDATE DATA BALANCE
        }
      } else if (transactionStatus == 'settlement') {
        await transactionModel.updateStatusTopup(
          { status: 'success', updatedAt: new Date() },
          orderId
        );
        await transactionModel.updateAmountUser(
          { amount: parseInt(amount) + parseInt(topupAmount), updatedAt: new Date() },
          id
        );
        // TODO set transaction status on your databaase to 'success'
        // [1] MENJALANKAN MODEL UNTUK GET DATA DARI TABLE BALANCE SUPAYA MENDAPATKAN USERID & TOPUPAMOUNT BERDASARKAN TOPUPID(ORDERID)
        // [2] MENJALANKAN MODEL UNTUK MENGUPDATE STATUS TOPUP BERDASARKAN TOPUPID(ORDERID)
        // [3] MENJALANKAN MODEL UNTUK MENGUPDATE DATA BALANCE
        // await updateBalance(userId, topupAmount)
      } else if (transactionStatus == 'deny') {
        await transactionModel.updateStatusTopup(
          { status: 'failed', updatedAt: new Date() },
          orderId
        );
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
      } else if (transactionStatus == 'cancel' || transactionStatus == 'expire') {
        await transactionModel.updateStatusTopup(
          { status: 'failed', updatedAt: new Date() },
          orderId
        );
        // TODO set transaction status on your databaase to 'failure'
        // [2] MENJALANKAN MODEL UNTUK MENGUPDATE STATUS TOPUP BERDASARKAN TOPUPID(ORDERID)
      } else if (transactionStatus == 'pending') {
        await transactionModel.updateStatusTopup(
          { status: 'failed', updatedAt: new Date() },
          orderId
        );
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        // [2] MENJALANKAN MODEL UNTUK MENGUPDATE STATUS TOPUP BERDASARKAN TOPUPID(ORDERID)
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
};
