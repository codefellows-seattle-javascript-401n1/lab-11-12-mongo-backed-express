'use strict';

const express = require('express');
const debug = require('debug');
const mongoose = require('mongoose');

const errorResponse = require('./lib/error-response');
const storeRouter = require('./route/store-router');

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/store';
const app = express();

// connecting to mongoDB via mongoose
mongoose.connect(mongoURI);

// error routing
app.use(errorResponse);

// GET, POST, DELETE routers
app.use('/api', storeRouter);

app. all('*', function(req, res){
  debug('* 404');
  res.status(404).send('not found');
});

// server start
const server = app.listen(port, function(){
  console.log('server started on port:', port);
});

server.isRunning = true;
module.exports = server;
