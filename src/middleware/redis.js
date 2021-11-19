const redis = require('@src/config/redis');
const helper = require('@src/helpers/wrapper');

module.exports = {
  getMovieByIdRedis: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getmovie:${id}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(res, 200, 'Success Get Data By Id', JSON.parse(result));
      } else {
        next();
      }
    });
  },
  getMovieRedis: (req, res, next) => {
    redis.get(`getmovie:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result != null) {
        const newResult = JSON.parse(result); // {result, pageInfo}
        return helper.response(res, 200, 'Success Get Movie', newResult.result, newResult.pageInfo);
      } else {
        next();
      }
    });
  },
  clearDataMovieRedis: (req, res, next) => {
    // proses pertama cari kunci yang berawalan getmovie
    redis.keys('getmovie:*', (_error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
      next();
    });
  },
};
