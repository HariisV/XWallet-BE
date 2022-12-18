const nodemailer = require('nodemailer');
const mustache = require('mustache');
const fs = require('fs');
require('dotenv').config();

const sendMail = (data) =>
  new Promise((resolve, reject) => {
    const { to, subject, template } = data;

    const fileTemplate = fs.readFileSync(`src/templates/email/${template}`, 'utf8');

    // const accessToken = OAuth2_client.getAccessToken;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'harisdevtest@gmail.com',
        pass: 'puggnzpcfsxfqqgy',
      },
    });

    const mailOptions = {
      from: '"ZWallet 👻" <harisdevtest@gmail.com>', // sender address
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
