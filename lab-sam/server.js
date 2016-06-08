'use strict';

const express = require('express');
const debug = require('debug')('dm:server');
const morgan = require('morgan');
const mongoose = require('mongoose');

const errorResponse = require('./lib/error-response');
const AppError = require('./lib/app-error');
// const npcRouter = require('./routes/npc-route');
const encounterRoute = require('./routes/encounter-route');

const port = process.env.PORT || 3000;
//address to our mongoD server
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/dm';
const app = express();
console.log('Using ' + mongoURI + ' database.');
//conect to data base
mongoose.connect(mongoURI);

app.use(errorResponse);
app.use(morgan('dev'));

// app.use('/api', npcRouter);
app.use('/api', encounterRoute);

app.all('*', function(req, res){
  debug('* 404');
  const err = new AppError.error404('route not found from server');
  res.sendError(err);
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('app running on port', port);
});

server.isRunning = true;
module.exports = server;
