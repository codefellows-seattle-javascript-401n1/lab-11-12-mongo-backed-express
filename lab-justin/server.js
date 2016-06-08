'use strict';

// npm modules
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('justin:server');
const mongoose = require('mongoose');
// const jsonParser = require('body-parser').json();

// app modules
const errorResponse = require('./lib/error-response');
const noteRouter = require('./route/note-router');
const taskRouter = require('./route/task-router');

// globals
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/justin';
const app = express();

// connect to database
mongoose.connect(mongoURI);

// middle ware
app.use(morgan('dev'));
app.use(errorResponse);
// app.use(jsonParser);

// routes
app.use('/api', noteRouter);
app.use('/api', taskRouter);
app.all('*', function(req, res){
  debug('404 *');
  res.status(404).send('not found');
});

// start server
const server = app.listen(port, function(){
  console.log('server up :)<-< ' + port);
});

// exprort server
server.isRunning = true;
module.exports = server;
