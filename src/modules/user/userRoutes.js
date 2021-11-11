const express = require('express');
const Route = express.Router();

const uploadHelper = require('@src/helpers/file/uploads');
const userController = require('@modules/user/userController');
const authMiddleware = require('@src/middleware/auth');

Route.get('/', authMiddleware.authentication, userController.getDataUser);
Route.get('/profile/:id', authMiddleware.authentication, userController.getDataUserById);
Route.get('/pin', authMiddleware.authentication, userController.checkPinUser);
Route.patch(
  '/image/:id',
  authMiddleware.authentication,
  uploadHelper,
  userController.updateImageUser
);
Route.patch('/profile/:id', authMiddleware.authentication, userController.updateProfileUser);
Route.patch('/pin/:id', authMiddleware.authentication, userController.updatePinUser);
Route.patch('/password/:id', authMiddleware.authentication, userController.updatePasswordUser);
Route.delete('/image/:id', authMiddleware.authentication, userController.deleteImage);

module.exports = Route;
