const connection = require('@src/config/mysql');

module.exports = {
  getDataCount: (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM user WHERE firstName LIKE '%${data}%' OR lastName LIKE '%${data}%' OR noTelp LIKE '%${data}%'`,
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    });
  },
  getDataAll: (limit, offset, search, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT id, firstName, lastName, noTelp, image FROM user WHERE firstName LIKE '%${search}%' OR lastName LIKE '%${search}%' OR noTelp LIKE '%${search}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error('SQL : ' + error.sqlMessage));
        }
      );
    }),
  getDataConditions: (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT id, firstName, lastName, email, image, noTelp FROM user WHERE ?',
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
