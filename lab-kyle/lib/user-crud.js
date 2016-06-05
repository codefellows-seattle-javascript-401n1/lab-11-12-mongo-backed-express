'use strict';

const Note = require('../model/user');
const AppErr = require('../lib/app-error');
const debug = require('debug')('awesomeNote:user-crud');

exports.createUser = function(reqBody){
  return new Promise((resolve, reject) => {
    if (! reqBody.email)
      return reject(AppErr.error400('User require\'s email'));
    if(! reqBody.name)
      return reject(AppErr.error400('User require\'s name'));

    reqBody.timestamp = new Date();
    const note = new Note(reqBody);
    note.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchUser = function(id){
  return new Promise((resolve, reject) => {
    debug('fetchUser');
    Note.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeAllNotes = function(){
  return Note.remove({});
};
