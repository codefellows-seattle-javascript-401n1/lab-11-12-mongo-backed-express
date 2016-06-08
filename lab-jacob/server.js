'use strict';

// npm modules
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('debug:resource-server');
const morgan = require('morgan');

// app modules
const errorResponse = require('./lib/error-response');
const deityRouter = require('./route/deity-router');
const beliefRouter = require('./route/belief-router');

// global variables
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/diety';
const app = express();

//connects to the database
mongoose.connect(mongoURI);

//here's our middleware
app.use(morgan('dev'));
app.use(errorResponse);

// here's our routes
app.use('/api', deityRouter);
app.use('/api', beliefRouter);
//app.use('/api', secondResourceRouter);
app.all('*', function(req, res){
  debug('404');
  res.status(404).send('not found from server');
});

// starts and exports server
const server = module.exports = app.listen(port, function(){
  console.log('server is good to go on port:', port);
});

server.isRunning = true;
