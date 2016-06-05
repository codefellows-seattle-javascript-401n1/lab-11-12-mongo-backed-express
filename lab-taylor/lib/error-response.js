'use strict';

const AppError = require('./AppError');
const debug = require('debug')('soccer:errorResponse');

module.exports = function(req, res, next) {
  res.errorResponse = function(err) {
    debug('sending error response', err);
    if (AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }

    res.status(500).send('internal server error');
  };

  next();
};
