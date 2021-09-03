const express = require("express");
const Route = express.Router();

const exportController = require("@modules/export/exportController");

Route.get("/transaction/:id", exportController.exportTransaction);

module.exports = Route;
