'use strict';

const debug = require('debug')('business:app-error');

const AppError = module.exports = function(message, statusCode, responseMessage){
  debug('creating app error');
  /*
  inherit the PROPERTIES of Error object.  syntax is method.call(context).  in this example that is Error.call(this)
  */
  Error.call(this);
  this.message = message;
  this.statusCode = statusCode;
  this.responseMessage = responseMessage;
};
/*
Inherit the prototype of Error.
Object.create returns an empty object with the specified prototype.
The Error object's prototype object is assigned to the empty object
any METHODS that Error prototype has we have on AppError prototype
*/
AppError.prototype = Object.create(Error.prototype);

/*
create convenience methods on the AppError that do not belong to instances of AppError.  They are examples of individual methods that are shared by all instances.
*/
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
  return new AppError(message, 500, 'internal server error');
};
