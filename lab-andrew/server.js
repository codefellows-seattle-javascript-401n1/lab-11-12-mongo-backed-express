'use strict';

const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('brewer:server');
const mongoose = require('mongoose');

const errorResponse = require('./lib/error-response');
const brewerRouter = require('./route/brewer-router');
const taskRouter = require('./router/task-router');

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/brewer';
const app = express();

mongoose.connect(mongoURI);

app.use(morgan('dev'));
app.use(errorResponse);

app.use('/api', brewerRouter);
app.all('*', function(req, res) {
  debug('404 *');
  res.status(404)
  .send('not found');
});

const server = app.listen(port, function() {
  console.log(`server running on PORT: ${port}`);
});

server.isRunning = true;
module.exports = server;
