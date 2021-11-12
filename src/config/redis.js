require("dotenv").config();
const redis = require("redis");

const client = redis.createClient({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  password: process.env.RDS_PASSWORD,
});

client.on("connect", () => {
  console.log("You're now connected redis instance !");
});

module.exports = client;
