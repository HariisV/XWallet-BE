const connection = require('@src/config/mysql');

module.exports = {
  getTransactionById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT u.firstName, u.lastName, u.balance, u.noTelp, u.image, t.amount, t.notes, t.status, t.createdAt FROM transfer AS t JOIN user AS u ON t.receiverId = u.id WHERE t.id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    });
  },
};
