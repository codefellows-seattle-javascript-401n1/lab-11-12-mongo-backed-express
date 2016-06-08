'use strict';

const express = require('express');
const morgan = require('morgan');
const debug = require('debug');
const mongoose = require('mongoose');

const errorResponse = require('./lib/error-response');
const heroRouter = require('./route/hero-router');
const powerRouter = require('./route/power-router');

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/hq';
const app = express();

mongoose.connect(mongoURI);

app.use(morgan('dev'));
app.use(errorResponse);

app.use('/api', heroRouter);
app.use('/api', powerRouter);
app.all('*', function(req,res){
  debug('404 *');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  console.log('HQ Server is up.  Welcome Hero');
});

server.usRunning = true;
module.exports = server;
