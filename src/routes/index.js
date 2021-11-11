const express = require('express');

const Route = express.Router();

const authRouter = require('@modules/auth/authRoutes');
const userRouter = require('@modules/user/userRoutes');
const transactionRouter = require('@modules/transaction/transactionRoutes');
const exportRouter = require('@modules/export/exportRoutes');
const dashboardRouter = require('@modules/dashboard/dashboardRoutes');

Route.use('/auth', authRouter);
Route.use('/user', userRouter);
Route.use('/transaction', transactionRouter);
Route.use('/export', exportRouter);
Route.use('/dashboard', dashboardRouter);

module.exports = Route;
