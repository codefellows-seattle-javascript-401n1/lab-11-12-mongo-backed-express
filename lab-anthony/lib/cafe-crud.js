'use strict';

const Cafe = require('../model/cafe');
const AppErr = require('../lib/app-error');
const debug = require('debug')('coffee:cafe-crud');

exports.createCafe = function(reqBody){
  debug('create cafe');
  return new Promise((resolve, reject)=>{
    if (!reqBody.cafeName)
      return reject(AppErr.error400('cafe requires cafe name'));
    if (!reqBody.cafeAdd)
      return reject(AppErr.error400('cafe requires a location address'));

    const cafe = new Cafe(reqBody);
    cafe.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.removeAllCafes = function(){
  return Cafe.remove();
};
