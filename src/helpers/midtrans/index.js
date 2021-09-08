const midtransClient = require('midtrans-client');
require('dotenv').config();

const snap = new midtransClient.Snap({
  isProduction: process.env.MT_PRODUCTION === 'true' ? true : false,
  serverKey: process.env.MT_SERVER_KEY,
  clientKey: process.env.MT_CLIENT_KEY,
});

module.exports = {
  post: ({ id, amount }) =>
    new Promise((resolve, reject) => {
      const parameter = {
        transaction_details: {
          order_id: id,
          gross_amount: amount,
        },
        credit_card: {
          secure: true,
        },
      };
      snap
        .createTransaction(parameter)
        .then((transaction) => {
          resolve(transaction.redirect_url);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    }),
  notif: (body) =>
    new Promise((resolve, reject) => {
      snap.transaction.notification(body).then((statusResponse) => {
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        // console.log(statusResponse);

        // console.log(
        //   `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
        // );
        resolve({ orderId, transactionStatus, fraudStatus });
      });
    }),
};
