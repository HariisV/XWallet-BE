const express = require("express");

const Route = express.Router();

const helloRouter = require("@modules/hello/helloRoutes");
const movieRouter = require("@modules/movie/movieRoutes");
const authRouter = require("@modules/auth/authRoutes");
const userRouter = require("@modules/user/userRoutes");
const mailRouter = require("@modules/mail/mailRoutes");
const transactionRouter = require("@modules/transaction/transactionRoutes");
const exportRouter = require("@modules/export/exportRoutes");

// [1]
// Route.get("/hello", (req, res) => {
//   res.status(200).send("Hello World");
// });

// [2]
Route.use("/hello", helloRouter);
Route.use("/movie", movieRouter);
Route.use("/auth", authRouter);
Route.use("/user", userRouter);
Route.use("/mail", mailRouter);
Route.use("/transaction", transactionRouter);
Route.use("/export", exportRouter);

module.exports = Route;
