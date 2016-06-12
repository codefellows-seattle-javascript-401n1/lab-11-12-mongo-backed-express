'use strict';

//npm modules
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('coffee:server');
const mongoose = require('mongoose');

//app modules
const errorResponse = require('./lib/error-response');
const cafeRouter = require('./route/cafe-router');
const drinkRouter = require('./route/drink-router');

//globals
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/coffee';
const app = express();

//connect to database
mongoose.connect(mongoURI);

//middleware
app.use(morgan('dev'));
app.use(errorResponse);
//routes
app.use('/api', cafeRouter);
app.use('/api', drinkRouter);
app.all('*', function(req, res){
  debug('404 *');
  res.status(404).send('not found');
});

//start server
const server = app.listen(port, function(){
  console.log('server started on port:', port);
});

//export server
server.isRunning = true;
module.exports = server;
