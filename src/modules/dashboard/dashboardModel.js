const connection = require('@src/config/mysql');

module.exports = {
  getTotalIncomeTopup: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT SUM(amount) AS total FROM topup WHERE userId = ? AND YEARWEEK(createdAt) = YEARWEEK(NOW()) GROUP BY userId`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    }),
  getTotalIncomeTransfer: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT SUM(amount) AS total FROM transfer WHERE receiverId = ? AND YEARWEEK(createdAt) = YEARWEEK(NOW()) GROUP BY receiverId`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    }),
  getTotalExpenseTransfer: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT SUM(amount) AS total FROM transfer WHERE senderId = ? AND YEARWEEK(createdAt) = YEARWEEK(NOW()) GROUP BY senderId`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    }),
  getListIncomeTopup: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT SUM(amount) AS total, MAX(createdAt) AS date FROM topup WHERE userId = ? AND YEARWEEK(createdAt) = YEARWEEK(NOW()) GROUP BY userId AND DATE(createdAt)`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    }),
  getListIncomeTransfer: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT SUM(amount) AS total, MAX(createdAt) AS date FROM transfer WHERE receiverId = ? AND YEARWEEK(createdAt) = YEARWEEK(NOW()) GROUP BY receiverId AND DATE(createdAt)`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    }),
  getListExpenseTransfer: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT SUM(amount) AS total, MAX(createdAt) AS date FROM transfer WHERE senderId = ? AND YEARWEEK(createdAt) = YEARWEEK(NOW()) GROUP BY senderId AND DATE(createdAt)`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    }),
};
