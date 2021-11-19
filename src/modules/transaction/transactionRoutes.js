const express = require('express');
const Route = express.Router();

const transactionController = require('@modules/transaction/transactionController');
const authMiddleware = require('@src/middleware/auth');

Route.post('/top-up', authMiddleware.authentication, transactionController.postTransaction);
Route.post('/midtrans-notification', transactionController.postMidtransNotif);
Route.post('/transfer', authMiddleware.authentication, transactionController.transferTransaction);
Route.get('/history', authMiddleware.authentication, transactionController.historyTransaction);
Route.get(
  '/history/:id',
  authMiddleware.authentication,
  transactionController.historyTransactionById
);

module.exports = Route;
