'use strict';

const Note = require('../model/note');
const AppErr = require('../lib/app-error');
const debug = require('debug')('note:note-crud');


exports.createNote = function(reqBody) {
  debug('createNote');
  return new Promise((resolve, reject) => {
    if(! reqBody.content){
      return reject(AppErr.error400('note requires content'));
    }
    if(! reqBody.name){
      return reject(AppErr.error400('note requires name'));
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
    Note.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};


exports.updateNote = function(id, reqBody){
  debug('update note');
  return new Promise((resolve, reject)=>{
    if (!reqBody.name) {
      return reject(AppErr.error400('bad request'));
    }
    if (!reqBody.content) {
      return reject(AppErr.error400('bad request'));
    }

    Note.findByIdAndUpdate(id, reqBody, {new: true})
    .then((note) => {
      if(!note)
        return reject((AppErr.error404('cannot find note id')));
      return resolve(note);
    })
    .catch((err) => {
      return reject((AppErr.error404(err.message)));
    });

  });
};

exports.deleteNote = function(id) {
  debug('deleteNote');
  return new Promise((resolve, reject) => {
    Note.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeAllNotes = function() {
  return Note.remove({});
};
