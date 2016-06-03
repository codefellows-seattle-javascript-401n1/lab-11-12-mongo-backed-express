'use strict';

const express = require('express');
const debug = require('debug')('soccer:server');
const logger = require('morgan');
const AppError = require('./lib/AppError');
const errorResponse = require('./lib/error-response');
const port = process.env.PORT || 3000;
const app = express();


app.use(logger('dev'));
app.use(errorResponse);

app.all('*', ((req, res) => {
  debug('* 404');
  const err = AppError.error404('route note found');
  res.errorResponse(err);
}));


const server = app.listen(port, () => {
  debug('listen');
  console.log('Server is running on', port);
});

server.isRunning = true;
module.exports = server;
