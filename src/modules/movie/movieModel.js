const connection = require("@src/config/mysql");

module.exports = {
  getDataAll: (limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movie LIMIT ? OFFSET ?",
        [limit, offset],
        (error, result) => {
          !error
            ? resolve(result)
            : reject(new Error("SQL : " + error.sqlMessage));
        }
      );
    }),
  getDataCount: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM movie",
        (error, result) => {
          !error
            ? resolve(result[0].total)
            : reject(new Error("SQL : " + error.sqlMessage));
        }
      );
    }),
  getDataById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movie WHERE id = ?",
        id,
        (error, result) => {
          !error
            ? resolve(result)
            : reject(new Error("SQL : " + error.sqlMessage));
        }
      );
    }),
  createData: (setData) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO movie SET ?", setData, (error, result) => {
        // !error ? resolve({id: result.inserId, ...setData}) : reject(new Error(error))
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...setData,
          };
          resolve(newResult);
        } else {
          reject(new Error("SQL : " + error.sqlMessage));
        }
      });
    }),
  updateData: (setData, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE movie SET ? WHERE id = ?",
        [setData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id,
              ...setData,
            };
            resolve(newResult);
          } else {
            reject(new Error("SQL : " + error.sqlMessage));
          }
        }
      );
    }),
  deleteData: () =>
    new Promise((resolve, reject) => {
      // DELETE FROM table_name WHERE some_column = some_value
    }),
};
