const helper = require("@src/helpers/wrapper");
const transactionModel = require("@modules/transaction/transactionModel");
const midtrans = require("@src/helpers/midtrans");

module.exports = {
  postTransaction: async (req, res) => {
    try {
      // [1] jika tidak menggunakan midtrans
      // menjalankan proses post data ke table topup status = berhasil
      // menjalankan proses update data balance
      const { id, amount } = req.body;
      // [2] jika menggunakan midtrans
      // menjalankan proses post data ke table topup status = pending
      // const topupData = menjalankan model untuk post data ke table topup
      const topupData = {
        id,
        amount,
      };
      const resultMidtrans = await midtrans.post(topupData);
      return helper.response(res, 200, "Success TopUp Please Confirm ...", {
        redirectUrl: resultMidtrans,
      });
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
        null
      );
    }
  },
  postMidtransNotif: async (req, res) => {
    try {
      // console.log(req.body);
      const resultMidtrans = await midtrans.notif(req.body);
      // console.log(resultMidtrans);
      const { orderId, transactionStatus, fraudStatus } = resultMidtrans;
      if (transactionStatus == "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
        } else if (fraudStatus == "accept") {
          // TODO set transaction status on your databaase to 'success'
          // [1] MENJALANKAN MODEL UNTUK GET DATA DARI TABLE BALANCE SUPAYA MENDAPATKAN USERID & TOPUPAMOUNT BERDASARKAN TOPUPID(ORDERID)
          // [2] MENJALANKAN MODEL UNTUK MENGUPDATE STATUS TOPUP BERDASARKAN TOPUPID(ORDERID)
          // [3] MENJALANKAN MODEL UNTUK MENGUPDATE DATA BALANCE
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // [1] MENJALANKAN MODEL UNTUK GET DATA DARI TABLE BALANCE SUPAYA MENDAPATKAN USERID & TOPUPAMOUNT BERDASARKAN TOPUPID(ORDERID)
        // [2] MENJALANKAN MODEL UNTUK MENGUPDATE STATUS TOPUP BERDASARKAN TOPUPID(ORDERID)
        // [3] MENJALANKAN MODEL UNTUK MENGUPDATE DATA BALANCE
        // await updateBalance(userId, topupAmount)
      } else if (transactionStatus == "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // [2] MENJALANKAN MODEL UNTUK MENGUPDATE STATUS TOPUP BERDASARKAN TOPUPID(ORDERID)
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        // [2] MENJALANKAN MODEL UNTUK MENGUPDATE STATUS TOPUP BERDASARKAN TOPUPID(ORDERID)
      }
      return helper.response(res, 200, "Success", null);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
        null
      );
    }
  },
};
