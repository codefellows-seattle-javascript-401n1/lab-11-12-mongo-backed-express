'use strict';

//npm modules
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('rito:server');
const mongoose = require('mongoose');

//app modules
const errorResponse = require('./lib/error-response');
const noteRouter = require('./route/note-router');
const taskRouter = require('./route/task-router');
//global
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/rito';
const app = express();
//connect to db
mongoose.connect(mongoURI);
//middleware
app.use(morgan('dev'));
app.use(errorResponse);
//routes
app.use('/api', noteRouter);
app.use('/api', taskRouter);
app.all('*', function(req, res){
  debug('404 *');
  res.status(404).send('not found');
});
//start server
const server = app.listen(port, function(){
  console.log('the server is running :)<-<'+ port);
});
//export server
server.isRunning =true;
module.exports = server;
