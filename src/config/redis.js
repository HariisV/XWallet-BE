require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT,
  password: process.env.RDS_PASS,
});

client.on('connect', () => {});

module.exports = client;
