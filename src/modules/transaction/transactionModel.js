const connection = require('@src/config/mysql');

module.exports = {
  postTopup: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO topup SET ?', data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error('SQL : ' + error.sqlMessage));
        }
      });
    });
  },
  updateStatusTopup: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE topup SET ? WHERE id = ?', [data, id], (error, result) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error('SQL : ' + error.sqlMessage));
        }
      });
    });
  },
  getDataTopup: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT u.id, u.balance, t.amount AS topupAmount FROM topup AS t JOIN user AS u ON t.userId = u.id WHERE t.id = '${id}' AND t.status = 'pending'`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    });
  },
  updateAmountUser: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE user SET ? WHERE id = ?', [data, id], (error, result) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error('SQL : ' + error.sqlMessage));
        }
      });
    });
  },
  addTransferHistory: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO transfer SET ?', data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error('SQL : ' + error.sqlMessage));
        }
      });
    });
  },
  updateTransferHistory: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE transfer SET ? WHERE id = ?', [data, id], (error, result) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error('SQL : ' + error.sqlMessage));
        }
      });
    });
  },
  getHistoryTransaction: (id, filter) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT u.firstName, u.lastName, t.id, t.amount, t.status, t.createdAt FROM topup AS t JOIN user AS u ON t.userId = u.id WHERE t.userId = ? AND ${filter}(t.createdAt) = ${filter}(NOW());
        SELECT u.firstName, u.lastName, t.id, t.amount, t.status, t.createdAt FROM transfer AS t JOIN user AS u ON t.senderId = u.id WHERE t.receiverId = ? AND ${filter}(t.createdAt) = ${filter}(NOW());
        SELECT u.firstName, u.lastName, t.id, t.amount, t.status, t.createdAt FROM transfer AS t JOIN user AS u ON t.receiverId = u.id WHERE t.senderId = ? AND ${filter}(t.createdAt) = ${filter}(NOW());`,
        [id, id, id],
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    });
  },
};
