const express = require('express');

require('dotenv').config();
require('module-alias/register');

const morgan = require('morgan');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routerNavigation = require('@src/routes');

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());
app.use(xss());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/', routerNavigation);
app.use('/*', (req, res) => {
  res.status(404).send('Path Not Found!');
});

// app.get("/hello", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {});
