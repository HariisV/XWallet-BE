const userModel = require('@modules/user/userModel');
const helper = require('@src/helpers/wrapper');
const deleteFile = require('@src/helpers/file/delete');
const bcrypt = require('bcrypt');

module.exports = {
  getDataUser: async (req, res) => {
    try {
      let { page, limit, search, sort } = req.query;
      page = page ? parseInt(page) : 1;
      limit = limit ? parseInt(limit) : 6;
      search = search ? search : '';
      sort = sort ? sort : 'id ASC';

      const totalData = await userModel.getDataCount(search);
      const totalPage = Math.ceil(totalData / limit);
      const offset = page * limit - limit;
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      const result = await userModel.getDataAll(limit, offset, search, sort);
      return helper.response(res, 200, 'Success get data', result, pageInfo);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  getDataUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const checkUser = await userModel.getDataConditions({ id });
      if (checkUser.length < 1) {
        return helper.response(res, 404, 'Id user not found', null);
      }
      return helper.response(res, 200, 'Success get data', checkUser[0]);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  updateImageUser: async (req, res) => {
    try {
      const { id } = req.params;
      const checkUser = await userModel.getDataConditions({ id });
      if (checkUser.length < 1) {
        return helper.response(res, 404, 'Id user not found', null);
      }

      if (!req.file) {
        return helper.response(res, 400, 'Image must be filled', null);
      }

      if (checkUser[0].image) {
        deleteFile(checkUser[0].image);
      }

      await userModel.updateDataUser({ image: req.file.filename, updatedAt: new Date() }, id);

      return helper.response(res, 200, 'Success update image user', { id, ...req.body });
    } catch (error) {
      deleteFile(req.file.filename);
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  checkPinUser: async (req, res) => {
    try {
      const { id, pin } = req.query;

      if (!id || !pin) {
        return helper.response(res, 400, 'Id or Pin must be filled', null);
      }

      const checkUser = await userModel.getDataPassConditions({ id });
      if (checkUser.length < 1) {
        return helper.response(res, 404, 'Id user not found', null);
      }

      if (pin !== checkUser[0].pin) {
        return helper.response(res, 400, 'Wrong pin', null);
      }

      return helper.response(res, 200, 'Success check pin', { id });
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  updateProfileUser: async (req, res) => {
    try {
      const { id } = req.params;
      const checkUser = await userModel.getDataConditions({ id });
      if (checkUser.length < 1) {
        return helper.response(res, 404, 'Id user not found', null);
      }

      let { noTelp, email, pin, image, password, status, amount } = req.body;
      if (amount) {
        delete req.body.amount;
      }
      if (email) {
        return helper.response(res, 400, 'Cannot update email', null);
      }
      if (pin) {
        return helper.response(res, 400, 'Cannot update pin', null);
      }
      if (image) {
        return helper.response(res, 400, 'Cannot update image', null);
      }
      if (password) {
        return helper.response(res, 400, 'Cannot update password', null);
      }
      if (status) {
        return helper.response(res, 400, 'Cannot update status', null);
      }

      if (noTelp) {
        if (noTelp[0] === '0') {
          noTelp = noTelp.substring(1);
        }
        if (checkUser[0].noTelp !== noTelp) {
          const checkUserByNoTelp = await userModel.getDataConditions({ noTelp });
          if (checkUserByNoTelp.length >= 1) {
            return helper.response(res, 400, 'No telp is already used', null);
          }
        }
      }

      await userModel.updateDataUser({ ...req.body, updatedAt: new Date() }, id);

      return helper.response(res, 200, 'Success update data user', { id, ...req.body });
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  updatePinUser: async (req, res) => {
    try {
      const { id } = req.params;
      let { pin } = req.body;

      const checkUser = await userModel.getDataConditions({ id });
      if (checkUser.length < 1) {
        return helper.response(res, 404, 'Id user not found', null);
      }

      pin = Number(pin);
      if (!pin || pin === NaN) {
        return helper.response(res, 400, 'Input your pin type is number', null);
      }
      if (`${pin}`.length !== 6) {
        return helper.response(res, 400, 'Length pin 6 number', null);
      }

      await userModel.updateDataUser({ pin, updatedAt: new Date() }, id);

      return helper.response(res, 200, 'Success update pin user', { id });
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? ' (' + error.message + ')' : ''}`,
        null
      );
    }
  },
  updatePasswordUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const salt = bcrypt.genSaltSync(10);
      const encryptPassword = bcrypt.hashSync(newPassword, salt);

      const checkUser = await userModel.getDataPassConditions({ id });
      if (checkUser.length < 1) {
        return helper.response(res, 404, 'Id user not found', null);
      }

      if (newPassword !== confirmPassword) {
        return helper.response(res, 400, 'Password not same', null);
      }

      const checkPassword = bcrypt.compareSync(oldPassword, checkUser[0].password);
      if (!checkPassword) {
        return helper.response(res, 400, 'Wrong password !');
      }

      await userModel.updateDataUser(
        { password: encryptPassword, updatedAt: new Date() },
        checkUser[0].id
      );

      return helper.response(res, 200, 'Success update password', { id });
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
