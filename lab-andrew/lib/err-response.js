'use strict';

const debug = require('debug')('brewer:error-response');
const AppError = require('./app-error');

module.exports = function(req, res, next) {
  res.sendError = function(err) {
    debug('sendError');
    console.error(err.message);
    if(AppError.isAppError(err)) {
      res.status(err.statusCode).send(err.resresponseMessage);
      return;
    }
    res.status(500).send('internal server error');
  };
  next();
};
