const userModel = require("@modules/user/userModel");
const helper = require("@src/helpers/wrapper");
const deleteFile = require("@src/helpers/file/delete");

module.exports = {
  updateUser: async (req, res) => {
    try {
      // console.log(req.file);
      // {
      //   fieldname: 'image',
      //   originalname: '72731ace4e60b8b76ceb81be039c5e5f.jpg',
      //   encoding: '7bit',
      //   mimetype: 'image/jpeg',
      //   destination: 'public/uploads',
      //   filename: '2021-08-27T07-46-42.216Z72731ace4e60b8b76ceb81be039c5e5f.jpg',
      //   path: 'public/uploads/2021-08-27T07-46-42.216Z72731ace4e60b8b76ceb81be039c5e5f.jpg',
      //   size: 36637
      // }
      // const data = {};
      // data.map((item) => item);
      res.status(200).send("Success Upload Image !");
    } catch (error) {
      deleteFile(req.file.filename);
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
        null
      );
    }
  },
};
