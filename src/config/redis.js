require("dotenv").config();
const redis = require("redis");
const client = redis.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
  console.log("You're now connected redis instance !");
});

module.exports = client;
