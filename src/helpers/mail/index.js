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
      html: mustache.render(fileTemplate, { ...data }),
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });

module.exports = sendMail;
