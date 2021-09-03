const redis = require("@src/config/redis");
const helper = require("@src/helpers/wrapper");
const jwt = require("jsonwebtoken");

module.exports = {
  authentication: (req, res, next) => {
    let token = req.headers.authorization;
    // const tokenCookies = req.cookies.accessToken;
    // console.log(token);
    // console.log(tokenCookies);
    if (!token) {
      return helper.response(res, 403, "Please login first !");
    }
    token = token.split(" ")[1];

    // proses validasi token
    jwt.verify(token, "RAHASIA", (error, result) => {
      if (
        (error && error.name === "JsonWebTokenError") ||
        (error && error.name === "TokenExpiredError")
      ) {
        return helper.response(res, 403, error.message);
      } else {
        // console.log(result) // berisi data sebelum di enkripsi
        redis.get(`accessToken:${token}`, (error, result) => {
          if (!error && result != null) {
            req.decodeToken = result; // {user_role: 'user'}
            next();
          } else {
            return helper.response(
              res,
              403,
              "Your token is destroyed please login again !"
            );
          }
        });
      }
    });
  },
  isAdmin: (req, res, next) => {
    // console.log("middleware isAdmin running !");
    // console.log(req.decodeToken);
    // check kondisi apakah user admin atau bukan ?
    // if (conditioncheckuserrole apakah admin ?) { // req.decodeToken.user_role === ?
    //   next()
    // } else {
    //   mengembalikan response bahwa endpoin ini tidak bisa diakses selain admin
    // }
    next();
  },
};
