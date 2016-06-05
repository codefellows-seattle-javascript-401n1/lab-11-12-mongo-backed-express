'use strict';

const Deity = require('../model/deity');
const AppErr = require('../lib/app-error');
const debug = require('debug')('deity:deity-crud');

exports.createDeity = function(reqBody){ // our create function
  debug('deity-createCrud');
  return new Promise((resolve, reject) => {
    if (!reqBody.name)
      return reject(AppErr.error400('deity require\'s a name'));
    if (!reqBody.power)
      return reject(AppErr.error400('deity require\'s a power'));
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
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.updateDeity = function(id, updateContent){ // update function
  debug('deity-updateCrud');
  return new Promise((resolve, reject) => {
    Deity.findOne({_id: id})
    .then((updateContent) => {
      if(updateContent.name){
        Deity.name = updateContent.name;
        resolve();
      }
      if(updateContent.power) {
        Deity.power = updateContent.power;
        resolve();
      }
    })
    .catch((err) => {
      if(!updateContent)
        reject(AppErr.error400(err.message));
      if(!id)
        reject(AppErr.error404(err.message));
    });
  });
};

// exports.deleteDeity = function(id) { // destroy function
//   debug('deity-deleteDeity');
//   return new Promise((resolve, reject) => {
//
//   });
// };

exports.removeAllDeities = function(){
  return Deity.remove();
};
