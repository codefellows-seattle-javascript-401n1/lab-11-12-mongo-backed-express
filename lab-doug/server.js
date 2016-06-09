'use strict';

//npm modules
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('business:server');
const mongoose = require('mongoose');
//app modules
const errorResponse = require('./lib/error-response');
const receiptRouter = require('./route/receipt-router');
//globals
const repairRouter = require('./route/repair-router');
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/business';

const app = express();
//mongoose client connects to mongo db
mongoose.connect(mongoURI);
app.use(errorResponse);
app.use(morgan('dev'));
app.use('/api', receiptRouter);
app.use('/api', repairRouter);

app.all('*', function(req, res){
  debug('this route is not registered');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('express app up on port: ', port);
});

server.isRunning = true;
module.exports = server;
