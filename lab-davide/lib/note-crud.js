'use strict';

const Note = require('../model/note');
const AppErr = require('../lib/app-error');
const debug = require('debug')('note:note-crud');


exports.createNote = function(reqBody) {
  debug('createNote');
  return new Promise((resolve, reject) => {
    if(! reqBody.content){
      return reject(AppErr.error400('note require\'s content'));
    }
    if(! reqBody.name){
      return reject(AppErr.error400('note require\'s name'));
    }
    reqBody.timestamp = new Date();
    const note = new Note(reqBody);
    note.save()
    .then(resolve)
    .catch(reject);
  });
};


exports.fetchNote = function(id) {
  debug('fetchNote');
  return new Promise((resolve, reject) => {
    if(!id){
      return reject(AppErr.error404('not found'));
    }

    Note.findOne({_id: id})
    .then(resolve)
    .catch(reject(AppErr.error404('not found')));
  });

};

exports.updateNote = function(reqBody, id) {
  debug('updateNote');
  return new Promise((resolve, reject) => {
    if(! reqBody.content){
      return reject(AppErr.error400('bad request'));
    }
    if(! reqBody.id){
      return reject(AppErr.error400('bad request'));
    }

    Note.findOne({_id: id})
    .then(resolve)
    .catch(reject(AppErr.error404('not found')));
  });
};


exports.deleteNote = function(id) {
  debug('deleteNote');
  return new Promise((resolve, reject) => {
    Note.findOne({_id: id})
    .then(resolve)
    .catch(reject);
  });
};

exports.removeAllNotes = function(){
  return Note.remove({});
};
