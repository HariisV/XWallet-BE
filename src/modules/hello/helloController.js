const helper = require("@src/helpers/wrapper");
const helloModel = require("@modules/hello/helloModel");

module.exports = {
  getHello: async (req, res) => {
    try {
      const result = await helloModel.getHello();
      return helper.response(res, 200, "Success Get Data", result);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
        null
      );
    }
  },
};
