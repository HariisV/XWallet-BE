const helper = require("@src/helpers/wrapper");
// const mailModel = require("@modules/mail/mailModel");
const sendMail = require("@src/helpers/mail");

module.exports = {
  sendMail: async (req, res) => {
    try {
      console.log("sendMail");
      const setEmail = {
        to: "bagustri15@gmail.com",
        subject: `Email Verification !`,
      };
      await sendMail(setEmail);
      return helper.response(res, 200, "Success Send Email", null);
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
