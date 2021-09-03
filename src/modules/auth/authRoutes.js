const express = require("express");
const Route = express.Router();

const authMiddleware = require("@src/middleware/auth");
const authController = require("@modules/auth/authController");

Route.get(
  "/hello",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  authController.sayHello
);
Route.post("/register", authController.register);
Route.post("/login", authController.login);
Route.post("/logout", authController.logout);

// REFRESH TOKEN
Route.post("/refresh-token", authController.refreshToken);

module.exports = Route;
