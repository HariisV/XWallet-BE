const connection = require('@src/config/mysql');

module.exports = {
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
