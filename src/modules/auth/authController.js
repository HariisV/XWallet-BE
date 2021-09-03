const redis = require("@src/config/redis");
const helper = require("@src/helpers/wrapper");
const authModel = require("@modules/auth/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const expToken = (day) => {
  return day * 24 * 60 * 60;
};

module.exports = {
  sayHello: async (req, res) => {
    try {
      res.status(200).send("Hello World");
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
        null
      );
    }
  },
  register: async (req, res) => {
    try {
      const { password } = req.body;
      const salt = bcrypt.genSaltSync(10);
      const encryptPassword = bcrypt.hashSync(password, salt);

      // console.log(`before Encrypt = ${password}`);
      // console.log(`after Encrypt = ${encryptPassword}`);

      const setData = {
        ...req.body,
        password: encryptPassword,
      };

      // kondisi cek email apakah ada di dalam database ?
      // jika ada response gagal msg = email sudah pernah di daftarkan
      // jika tidak ada = menjalankan proses model register user
      const result = await authModel.register(setData);
      delete result.password;
      return helper.response(res, 200, "Success Register User", result);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
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
      // console.log(checkEmailUser)
      // proses 1 pengecekkan apakah email ada di database atau tidak ?
      if (checkEmailUser.length > 0) {
        // proses 2 pengecekan password apakah password yang dimasukkan sesuai atau tidak
        const checkPassword = bcrypt.compareSync(
          password,
          checkEmailUser[0].password
        );
        if (checkPassword) {
          const payload = checkEmailUser[0];
          delete payload.password;
          const token = jwt.sign({ ...payload }, "RAHASIA", {
            expiresIn: expToken(1),
          });
          redis.setex(`accessToken:${token}`, expToken(1), token);
          res.cookie("accessToken", token, {
            httpOnly: true,
            expToken: expToken(1) * 1000,
          });
          // REFRESH TOKEN
          const refreshToken = jwt.sign({ ...payload }, "RAHASIA", {
            expiresIn: expToken(2),
          });
          redis.setex(
            `refreshToken:${refreshToken}`,
            expToken(2),
            JSON.stringify({
              id: checkEmailUser[0].id,
              token,
            })
          );
          // END REFRESH TOKEN
          const result = { ...payload, token, refreshToken };
          return helper.response(res, 200, "Success login !", result);
        } else {
          return helper.response(res, 400, "Wrong password !");
        }
      } else {
        return helper.response(res, 404, "Email / Account not registed");
      }
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
        null
      );
    }
  },
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      const { refreshToken } = req.body;
      redis.del(`accessToken:${token}`);
      res.cookie("accessToken", "", { expToken: 1 });
      // REFRESH TOKEN
      redis.del(`refreshToken:${refreshToken}`);
      // END REFRESH TOKEN
      return helper.response(res, 200, "Success logout !", null);
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
        null
      );
    }
  },
  // REFRESH TOKEN
  refreshToken: async (req, res) => {
    try {
      const { id, refreshToken } = req.body;
      redis.get(`refreshToken:${refreshToken}`, (error, result) => {
        if (!error && result != null) {
          const data = JSON.parse(result);
          const previousToken = data.token;
          if (parseInt(id) !== parseInt(data.id)) {
            return helper.response(
              res,
              403,
              "Your token is wrong please login again !"
            );
          }
          jwt.verify(refreshToken, "RAHASIA", (error, result) => {
            if (
              (error && error.name === "JsonWebTokenError") ||
              (error && error.name === "TokenExpiredError")
            ) {
              return helper.response(res, 403, error.message);
            } else {
              delete result.iat;
              delete result.exp;
              const token = jwt.sign(result, "RAHASIA", {
                expiresIn: expToken(1),
              });
              redis.del(`accessToken:${previousToken}`);
              redis.setex(`accessToken:${token}`, expToken(1), token);
              redis.setex(
                `refreshToken:${refreshToken}`,
                expToken(1),
                JSON.stringify({
                  id,
                  token,
                })
              );
              const newResult = { ...result, token, refreshToken };
              return helper.response(
                res,
                200,
                "Success Refresh Token !",
                newResult
              );
            }
          });
        } else {
          return helper.response(
            res,
            403,
            "Your token is expired please login again !"
          );
        }
      });
    } catch (error) {
      return helper.response(
        res,
        400,
        `Bad Request${error.message ? " (" + error.message + ")" : ""}`,
        null
      );
    }
  },
  // END REFRESH TOKEN
};
