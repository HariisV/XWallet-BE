const express = require('express');
const Route = express.Router();

const uploadHelper = require('@src/helpers/file/uploads');
const userController = require('@modules/user/userController');

Route.get('/', userController.getDataUser);
Route.get('/profile/:id', userController.getDataUserById);
Route.get('/pin', userController.checkPinUser);
Route.patch('/image/:id', uploadHelper, userController.updateImageUser);
Route.patch('/profile/:id', userController.updateProfileUser);
Route.patch('/pin/:id', userController.updatePinUser);
Route.patch('/password/:id', userController.updatePasswordUser);

module.exports = Route;
