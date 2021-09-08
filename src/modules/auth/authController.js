const redis = require('@src/config/redis');
const helper = require('@src/helpers/wrapper');
const authModel = require('@modules/auth/authModel');
const sendMail = require('@src/helpers/mail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const expToken = (day) => {
  return day * 24 * 60 * 60;
};

const generateKey = (n) => {
  var add = 1,
    max = 12 - add;

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10;
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ('' + number).substring(add);
};

module.exports = {
  register: async (req, res) => {
    try {
      const { firstName, email, password, amount } = req.body;
      const { URL_BACKEND } = process.env;
      const salt = bcrypt.genSaltSync(10);
      const encryptPassword = bcrypt.hashSync(password, salt);
      const keys = generateKey(6);

      if (amount) {
        delete req.body.amount;
      }

      const setData = {
        ...req.body,
        password: encryptPassword,
        keysVerifyAccount: keys,
        status: 0,
      };

      const checkUser = await authModel.getDataConditions({ email });
      if (checkUser.length >= 1) {
        return helper.response(res, 400, 'Email already exist', null);
      }

      const setSendEmail = {
        to: email,
        subject: `Email Verification !`,
        name: firstName,
        buttonUrl: `${URL_BACKEND}/verify/${keys}`,
        template: 'emailVerification.html',
      };
      await sendMail(setSendEmail);

      const result = await authModel.register(setData);
      delete result.password;
      delete result.keysVerifyAccount;
      return helper.response(res, 200, 'Success register user', result);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkEmailUser = await authModel.getDataConditions({
        email,
      });

      if (checkEmailUser.length < 1) {
        return helper.response(res, 404, 'Email / Account not registed');
      }

      if (checkEmailUser[0].status === 0) {
        return helper.response(res, 400, 'Account not active');
      }

      const checkPassword = bcrypt.compareSync(password, checkEmailUser[0].password);
      if (!checkPassword) {
        return helper.response(res, 400, 'Wrong password !');
      }

      const payload = checkEmailUser[0];
      delete payload.password;
      delete payload.keysChangePassword;
      delete payload.keysVerifyAccount;
      delete payload.minuteDiff;
      const token = jwt.sign({ ...payload }, 'RAHASIA', {
        expiresIn: expToken(1),
      });
      redis.setex(`accessToken:${token}`, expToken(1), token);
      const result = { ...payload, token };
      return helper.response(res, 200, 'Success login !', result);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      if (token) {
        token = token.split(' ')[1];
        redis.del(`accessToken:${token}`);
      }
      return helper.response(res, 200, 'Success logout !', null);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email, linkDirect } = req.body;
      const keysChangePassword = generateKey(6);

      const checkUser = await authModel.getDataConditions({ email });
      if (checkUser.length < 1) {
        return helper.response(res, 400, 'Email / Account not registed', null);
      }

      await authModel.updateDataUser(
        { keysChangePassword, updatedAt: new Date() },
        checkUser[0].id
      );

      const setSendEmail = {
        to: email,
        subject: `Reset Password !`,
        name: checkUser[0].firstName,
        buttonUrl: `${linkDirect}/${keysChangePassword}`,
        template: 'forgotPassword.html',
      };
      await sendMail(setSendEmail);

      return helper.response(res, 200, 'Process success, please check your email !', email);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { keysChangePassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return helper.response(res, 400, 'Password not same', null);
      }

      const checkUser = await authModel.getDataConditions({ keysChangePassword });
      if (checkUser.length < 1) {
        return helper.response(
          res,
          400,
          'Your keys is not valid, please repeat step forgot password',
          null
        );
      }

      const { id, minuteDiff } = checkUser[0];
      if (minuteDiff < -5) {
        await authModel.updateDataUser({ keysChangePassword: null, updatedAt: new Date() }, id);
        return helper.response(
          res,
          400,
          'Your keys is expired, please repeat step forgot password',
          null
        );
      }

      const salt = bcrypt.genSaltSync(10);
      const encryptPassword = bcrypt.hashSync(newPassword, salt);

      await authModel.updateDataUser(
        { keysChangePassword: null, password: encryptPassword, updatedAt: new Date() },
        id
      );
      return helper.response(res, 200, 'Success change password', id);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  verify: async (req, res) => {
    try {
      const { keys } = req.params;
      if (!keys) {
        return helper.response(res, 400, 'Please input you keys!', null);
      }

      const checkUser = await authModel.getDataConditions({ keysVerifyAccount: keys });
      if (checkUser.length < 1) {
        return helper.response(
          res,
          400,
          'Your keys is not valid, please check your email again',
          null
        );
      }

      await authModel.updateDataUser(
        { keysVerifyAccount: null, status: 1, updatedAt: new Date() },
        checkUser[0].id
      );

      return helper.response(res, 200, 'Success verify account, please login', null);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
};
