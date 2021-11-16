const nodemailer = require('nodemailer');
const mustache = require('mustache');
const fs = require('fs');
require('dotenv').config();

const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(
  '699950261067-3po57i42aaov8iab84vq6va4ollefasn.apps.googleusercontent.com',
  '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'
);
OAuth2_client.setCredentials({
  refresh_token:
    '1//04L1YJbF2IE8NCgYIARAAGAQSNwF-L9IrqEB1DowQmMVso5uySaqBVIyMXGypbBv25PqXJ8JdhW4p2S-0_Rfaz5ues-q-wD_ZqjE',
});

const sendMail = (data) =>
  new Promise((resolve, reject) => {
    const { to, subject, template } = data;

    const fileTemplate = fs.readFileSync(`src/templates/email/${template}`, 'utf8');

    const accessToken = OAuth2_client.getAccessToken;

    // https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4N78ToeMZfGrjVbk-kR95NcXdeZBPjuMIbllyX9vO7Te7z9HXQNo8LA0WUR_ACHHXAg2l4G67dmKBk8loxwQiA_wxRYvQ
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true, // true for 465, false for other ports
    //   auth: {
    //     user: process.env.SMTP_EMAIL, // generated ethereal user
    //     pass: process.env.SMTP_PASSWORD, // generated ethereal password
    //   },
    // });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'memo.in.aja@gmail.com',
        clientId: '699950261067-3po57i42aaov8iab84vq6va4ollefasn.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken:
          '1//04L1YJbF2IE8NCgYIARAAGAQSNwF-L9IrqEB1DowQmMVso5uySaqBVIyMXGypbBv25PqXJ8JdhW4p2S-0_Rfaz5ues-q-wD_ZqjE',
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: '"ZWallet 👻" <memo.in.aja@gmail.com>', // sender address
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
