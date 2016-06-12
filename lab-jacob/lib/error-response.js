'use strict';

const debug = require('debug')('deity:error-response');
const AppError = require('./app-error');

module.exports = function(req, res, next) { // our error response middleware for sending errors on the response object
  res.sendError = function(err){
    debug('inside error-response');
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('internal server error - App Error');
  };
  next();
};
