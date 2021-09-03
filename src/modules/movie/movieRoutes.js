const express = require("express");
const Route = express.Router();

const redisMiddleware = require("@src/middleware/redis");

const movieController = require("@modules/movie/movieController");

Route.get("/", redisMiddleware.getMovieRedis, movieController.getAllMovie);
Route.get(
  "/:id",
  redisMiddleware.getMovieByIdRedis,
  movieController.getMovieById
);
Route.post("/", redisMiddleware.clearDataMovieRedis, movieController.postMovie);
Route.patch(
  "/:id",
  redisMiddleware.clearDataMovieRedis,
  movieController.updateMovie
);
Route.delete(
  "/",
  redisMiddleware.clearDataMovieRedis,
  movieController.deleteMovie
);

module.exports = Route;
