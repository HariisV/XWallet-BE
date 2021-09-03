const connection = require("@src/config/mysql");

module.exports = {
  getHello: () =>
    new Promise((resolve, reject) => {
      const result = "Hello World !"
      const error = false
      !error ? resolve(result) : reject(new Error("Error get data"));

      // WITH SQL
      // connection.query(
      //   "QUERY SQL",
      //   (error, result) => {
      //     // CALLBACK
      //     !error ? resolve(result) : reject(new Error(error));
      //   }
      // );
    }),
}