const express = require("express");
const Route = express.Router();

const helloController = require("@modules/hello/helloController");

Route.get("/", helloController.getHello);

module.exports = Route;