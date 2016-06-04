'use strict';

const express = require('express');
const debug = require('debug')('soccer:server');
const logger = require('morgan');
const mongoose = require('mongoose');
const AppError = require('./lib/AppError');
const errorResponse = require('./lib/error-response');
const playerRouter = require('./route/player-router');
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/soccerapp';
const app = express();

mongoose.connect(mongoURI);

app.use(logger('dev'));
app.use(errorResponse);

app.use('/api', playerRouter);

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
