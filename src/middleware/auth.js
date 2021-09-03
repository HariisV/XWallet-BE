const redis = require('@src/config/redis');
const helper = require('@src/helpers/wrapper');
const jwt = require('jsonwebtoken');

module.exports = {
  authentication: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return helper.response(res, 403, 'Please login first !');
    }
    token = token.split(' ')[1];

    jwt.verify(token, 'RAHASIA', (error, result) => {
      if (
        (error && error.name === 'JsonWebTokenError') ||
        (error && error.name === 'TokenExpiredError')
      ) {
        return helper.response(res, 403, error.message);
      } else {
        redis.get(`accessToken:${token}`, (error, result) => {
          if (!error && result != null) {
            req.decodeToken = result;
            next();
          } else {
            return helper.response(res, 403, 'Your token is destroyed please login again !');
          }
        });
      }
    });
  },
};
