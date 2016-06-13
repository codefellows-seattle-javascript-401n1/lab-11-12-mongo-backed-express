'use strict';

//npm modules//
const debug = require('debug')('note: server');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

//app modules//
const noteRouter = require('./route/note-router');
const taskRouter = require('./route/task-router');
const errorResponse = require('./lib/error-response');
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/note';
const port = process.env.PORT || 3000;
const app = express();

//connect to database//
mongoose.connect(mongoURI);

//enabling middleware//
app.use(morgan('dev'));
app.use(errorResponse);

//routes//
app.use('/api', taskRouter);
app.use('/api', noteRouter);
app.all('*', function(req, res) {

  debug('*404');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('app is up on port');
});

//we make this true so we can check this in testing//
server.isRunning = true;
module.exports = server;
