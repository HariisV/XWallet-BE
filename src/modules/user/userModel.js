const connection = require('@src/config/mysql');

module.exports = {
  getDataCount: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM user WHERE NOT id = ? AND (firstName LIKE '%${data}%' OR lastName LIKE '%${data}%' OR noTelp LIKE '%${data}%')`,
        [id],
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    });
  },
  getDataAll: (limit, offset, search, sort, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT id, firstName, lastName, noTelp, image FROM user WHERE NOT id = ? AND (firstName LIKE '%${search}%' OR lastName LIKE '%${search}%' OR noTelp) LIKE '%${search}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [id, limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    }),
  getDataConditions: (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT id, firstName, lastName, email, image, noTelp, balance FROM user WHERE ?',
        data,
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    });
  },
  getDataPassConditions: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT id, password, pin FROM user WHERE ?', data, (error, result) => {
        !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
      });
    });
  },
  updateDataUser: (data, id) => {
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
};
