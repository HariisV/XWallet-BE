const express = require('express');
const Route = express.Router();
const authMiddleware = require('@src/middleware/auth');

const exportController = require('@modules/export/exportController');

Route.get('/transaction/:id', authMiddleware.authentication, exportController.exportTransaction);

module.exports = Route;
