const nodemailer = require("nodemailer");
const mustache = require("mustache");
const fs = require("fs");
require("dotenv").config();

const sendMail = (data) =>
  new Promise((resolve, reject) => {
    const fileTemplate = fs.readFileSync(
      `src/templates/email/test.html`,
      "utf8"
    );

    const { to, subject } = data;
    // https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4N78ToeMZfGrjVbk-kR95NcXdeZBPjuMIbllyX9vO7Te7z9HXQNo8LA0WUR_ACHHXAg2l4G67dmKBk8loxwQiA_wxRYvQ
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
      },
    });
    const mailOptions = {
      from: '"Tickitz 👻" <memo.in.aja@gmail.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      // html: `<b>Click Here to activate </b><a href='http://localhost:3001/api/v1/user-activation/${to}'>Click !</>`, // html body
      html: mustache.render(fileTemplate, { ...data }),
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        reject(error);
      } else {
        // console.log("Email sent:" + info.response);
        resolve(info.response);
      }
    });
  });

module.exports = sendMail;
