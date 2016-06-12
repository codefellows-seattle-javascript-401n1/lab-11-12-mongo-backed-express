'use strict';

const debug = require('debug')('deity:app-error');

const AppError = module.exports = function(statusCode, message,  responseMessage) { // Our error constructor for status errors
  debug('app-error');
  Error.call(this); // inherits the properties of the error object
  this.statusCode = statusCode;
  this.message = message;
  this.responseMessage = responseMessage;
};

AppError.prototype = Object.create(Error.prototype); // creates an emtpy object with the Error object prototype, and assigns it to the AppErrors prototy

AppError.isAppError = function(err) { // functions for the AppError constructor
  debug('apperror');
  return err instanceof AppError;
};

AppError.error404 = function(message){
  debug('error404');
  return new AppError(404, message, 'not found');
};

AppError.error400 = function(message){
  debug('error400');
  return new AppError(400, message, 'bad request');
};

AppError.error500 = function(message){
  debug('error500');
  return new AppError(500, message, 'server error');
};
