'use strict';

const AppError = require('./AppError');

module.exports = function(req, res, next) {
  res.errorResponse = function(err) {
    console.error(err);

    if (AppError.isAppError(err)){
      res.status(err.statusCode).send(err.response);
      return;
    }

    res.status(500).send('internal server error');
  };

  next();
};
