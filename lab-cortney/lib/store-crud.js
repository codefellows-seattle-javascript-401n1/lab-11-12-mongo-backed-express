'use strict';

const debug = require('debug')('store:store-crud');

const Store = require('../model/store');
const AppError = require('./app-error');

exports.createStore = function(reqBody){
  return new Promise((resolve, reject) => {
    if (!reqBody.content){
      return reject(AppError.error400('store requires a store name'));
    }
    if (!reqBody.name)
  });
}
