const connection = require("@src/config/mysql");

module.exports = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO user SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error("SQL : " + error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    });
  },
  getDataConditions: (data) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM user WHERE ?", data, (error, result) => {
        !error
          ? resolve(result)
          : reject(new Error("SQL : " + error.sqlMessage));
      });
    });
  },
};
