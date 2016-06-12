'use strict';

const debug = require('debug')('deity:deity-crud');

const Deity = require('../model/deity');
const AppError = require('../lib/app-error');

exports.createDeity = function(reqBody){ // our create function
  debug('deity-createCrud');
  return new Promise((resolve, reject) => {
    if (!reqBody) {
      return reject(AppError.error400('bad request'));
    }
    if (!reqBody.name || !reqBody.power) {
      return reject(AppError.error400('deity requires a power and a name'));
    }
    const deity = new Deity(reqBody);
    deity.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchDeity = function(id){ // our read function
  debug('deity-readCrud');
  return new Promise((resolve, reject) => {
    Deity.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.updateDeity = function(id, updateContent){ // update function
  debug('deity-updateCrud');
  return new Promise((resolve, reject) => {
    if(!updateContent.name && !updateContent.power) {
      console.log('first if');
      return reject(AppError.error400('bad request'));
    }
    if(!id) {
      console.log('second if');
      return reject(AppError.error400('bad request'));
    }
    Deity.findOne({_id: id})
    .then((deity) => {
      if(updateContent.name){
        deity.name = updateContent.name;
      }
      if(updateContent.power) {
        deity.power = updateContent.power;
      }
      deity.save()
      .then( deity => resolve(deity))
      .catch( err => reject(AppError.error500(err.message)));
    })
    .catch((err) => {
      return reject(AppError.error404(err.message)); //Only when the DB breaks
    });
  });

};

exports.deleteDeity = function(id) { // destroy function
  debug('deity-deleteDeity');
  return new Promise((resolve, reject) => {
    Deity.findOne({_id: id})
    .then((deity) => {
      Deity.remove(deity)
      .then( deity => resolve(deity))
      .catch( deity => reject(deity));
    }).catch( err => reject(AppError.error404(err.message)));
  });
};

exports.removeAllDeities = function(){
  return Deity.remove();
};
