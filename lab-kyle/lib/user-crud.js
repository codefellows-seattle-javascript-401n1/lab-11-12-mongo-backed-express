'use strict';

const User = require('../model/user');
const AppErr = require('../lib/app-error');
const debug = require('debug')('awesomeNote:user-crud');

exports.createUser = function(reqBody){
  return new Promise((resolve, reject) => {
    if (! reqBody.email)
      return reject(AppErr.error400('User require\'s email'));
    if(! reqBody.name)
      return reject(AppErr.error400('User require\'s name'));

    reqBody.timestamp = new Date();
    const user = new User(reqBody);
    user.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchUser = function(id){
  return new Promise((resolve, reject) => {
    debug('fetchUser');
    User.findOne({_id: id})
    .then(user => resolve(user))
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.updateUser = function(id, data){
  return new Promise((resolve, reject) => {
    if(!id){
      var err = AppErr.error400('bad request');
      return reject(err);
    }
    if(!data){
      err = AppErr.error400('bad request');
      return reject(err);
    }
    if(!data.email){
      err = AppErr.error400('bad request');
      return reject(err);
    }

    User.findOne({_id: id})
   .then(() => {
     User.update({_id: id}, data)
     .then(() => {
       User.findOne({_id: id})
       .then(resolve)
       .catch(reject);
     })
    .catch( err => reject(AppErr.error400(err.mesage)));
   })
  .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeOneUser = function(id){
  return new Promise ((resolve, reject) => {
    debug('delete one user');
    User.findOne({_id: id})
    .then(() => {
      User.remove({_id: id})
      .then(resolve)
      .catch(err => reject(AppErr.error500(err.message)));
    })
    .catch(err => reject(AppErr.error404(err.message)));
  });
};
exports.removeAllUsers = function(){
  return User.remove({});
};
