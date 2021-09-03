const express = require("express");
const Route = express.Router();

const mailController = require("@modules/mail/mailController");

Route.get("/", mailController.sendMail);

module.exports = Route;
