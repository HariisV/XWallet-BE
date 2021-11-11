const express = require('express');
const Route = express.Router();

const dashboardController = require('@modules/dashboard/dashboardController');
const authMiddleware = require('@src/middleware/auth');

Route.get('/:id', authMiddleware.authentication, dashboardController.getDataDashboard);

module.exports = Route;
