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

exports.fetchCafe = function(id){
  debug('fetch cafe');
  return new Promise((resolve, reject)=>{
    Cafe.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.editCafe = function(id, reqBody){
  debug('edit cafe');
  console.log('THE REQBODY IS', reqBody);
  return new Promise((resolve, reject)=>{
    if (!reqBody.cafeName && !reqBody.cafeAdd) {
      return reject(AppErr.error400('cafe requires new name or address'));
    }

    Cafe.findByIdAndUpdate(id, reqBody)
    .then(()=> Cafe.findOne({_id: id})).then(resolve)
    .catch((err) => {
      return reject((AppErr.error404(err.message)));
    });
  });
};

exports.removeCafe = function(id){
  debug('remove cafe');
  return new Promise((resolve, reject)=>{
    Cafe.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeAllCafes = function(){
  return Cafe.remove();
};
