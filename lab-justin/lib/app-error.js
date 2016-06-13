'use strict';

const debug = require('debug')('justin:app-error');

const AppError = module.exports = function(message, statusCode, responseMessage){
  debug('creating app error');
  Error.call(this);
  this.message = message;
  this.statusCode = statusCode;
  this.responseMessage = responseMessage;
};

AppError.prototype = Object.create(Error.prototype);

AppError.isAppError = function(err){
  debug('isAppError');
  return err instanceof AppError;
};

AppError.error400 = function(message){
  debug('error400');
  return new AppError(message, 400, 'bad request');
};

AppError.error404 = function(message){
  debug('error404');
  return new AppError(message, 404, 'not found');
};

AppError.error500 = function(message){
  debug('error500');
  return new AppError(message, 500, 'interal server error');
};

AppError.error204 = function(message) {
  debug('error204');
  return new AppError(message, 204, 'no content');
};
