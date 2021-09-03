const express = require("express");
const Route = express.Router();

const uploadHelper = require("@src/helpers/file/uploads");
const userController = require("@modules/user/userController");

Route.patch("/:id", uploadHelper, userController.updateUser);

module.exports = Route;
