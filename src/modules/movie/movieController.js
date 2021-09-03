const redis = require("@src/config/redis");
const helper = require("@src/helpers/wrapper");
const movieModel = require("@modules/movie/movieModel");

module.exports = {
  getAllMovie: async (req, res) => {
    try {
      let { page, limit, searchByName } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      // console.log('searchdata = 'searchByName)
      // betikan default value
      // page = 1
      // limit = 10
      // sort = movie_id ASC
      // search = ''
      const totalData = await movieModel.getDataCount();
      const totalPage = Math.ceil(totalData / limit);
      const offset = page * limit - limit;
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getDataAll(limit, offset, searchByName);
      // for (const value of result) {
      //   // console.log(value.user_id)
      //   // value.skill = await movieModel.getSkillByUserId(value.user_id)
      //   value.skill = [
      //     { skill_id: 1, skill_name: "Javascript" },
      //     { skill_id: 2, skill_name: "PHP" },
      //   ];
      // }
      // console.log(req.query)
      redis.setex(
        `getmovie:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );
      return helper.response(res, 200, "Success Get Data", result, pageInfo);
    } catch (error) {
      return helper.response(res, 400, "Bad Request", error);
    }
  },
  getMovieById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await movieModel.getDataById(id);
      // kondisi pengecekan apakah data di dalam databe dengan id ..
      // console.log(result) // [] | [......]
      if (result.length > 0) {
        redis.set(`getmovie:${id}`, JSON.stringify(result));
        return helper.response(res, 200, "Success Get Data By Id", result);
      } else {
        return helper.response(res, 404, "Data By Id ... Not Found !", null);
      }
    } catch (error) {
      return helper.response(res, 400, "Bad Request", error);
    }
  },
  postMovie: async (req, res) => {
    try {
      const { name, category, releaseDate } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        updatedAt: new Date(Date.now()),
      };
      const result = await movieModel.createData(setData);
      return helper.response(res, 200, "Success Create Movie", result);
    } catch (error) {
      return helper.response(res, 400, "Bad Request", error);
    }
  },
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      // kondisi pengecekan apakah data di dalam database ada berdasarkan id ...
      // proses untuk mendeleta file lama
      const { name, category, releaseDate } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        updatedAt: new Date(Date.now()),
      };
      const result = await movieModel.updateData(setData, id);
      return helper.response(res, 200, "Success Update Movie", result);
    } catch (error) {
      return helper.response(res, 400, "Bad Request", error);
    }
  },
  deleteMovie: async (req, res) => {
    try {
      // 1. buat request di post
      // 2. set up controller dan model
      // 3. mendelete data yang ada di dalam folder uploads fs.unlink
      console.log(req.params);
      // hasil response untuk delete id yg kedelete saja
    } catch (error) {
      return helper.response(res, 400, "Bad Request", error);
    }
  },
};
