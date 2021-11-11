const express = require('express');
const Route = express.Router();

const authController = require('@modules/auth/authController');

Route.post('/register', authController.register);
Route.post('/login', authController.login);
Route.post('/logout', authController.logout);

Route.post('/forgot-password', authController.forgotPassword);
Route.patch('/reset-password', authController.resetPassword);
Route.get('/verify/:keys', authController.verify);

module.exports = Route;
