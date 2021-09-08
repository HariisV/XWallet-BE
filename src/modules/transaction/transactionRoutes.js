const express = require('express');
const Route = express.Router();

const transactionController = require('@modules/transaction/transactionController');

Route.post('/top-up', transactionController.postTransaction);
Route.post('/midtrans-notification', transactionController.postMidtransNotif);

module.exports = Route;
