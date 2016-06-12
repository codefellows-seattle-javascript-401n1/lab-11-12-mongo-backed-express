'use strict';

const Note = require('../model/note');
const AppError = require('./app-error');
// const debug = require('debug')('ronito:note-crud');

exports.createNote = function(reqBody){
  return new Promise((resolve, reject) =>{
    if(! reqBody.content)
      return reject(AppError.error400('notes requires content'));
    if(! reqBody.name)
      return reject(AppError.error400('note requires name'));
    reqBody.timestamp = new Date();
    const note = new Note(reqBody);
    note.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchNote = function(id){
  return new Promise((resolve, reject) => {
    Note.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.removeAllNotes=function(){
  return Note.remove({});
};
