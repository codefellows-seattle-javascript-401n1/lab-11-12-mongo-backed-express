'use strict';

const Note = require('../model/note');
const AppError = require('./app-error');
// const debug = require('debug')('ronito:note-crud');

exports.createNote = function(reqBody){
  return new Promise((resolve, reject) =>{
    if(!reqBody.content)
      return reject(AppError.error400('notes requires content'));
    if(!reqBody.name)
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
exports.updateNote = function(id, data){
  return new Promise((resolve, reject) => {
    if(!id){
      var err = AppError.error400('bad request');
      return reject(err);
    }
    if(!data){
      err = AppError.error400('bad request');
      return reject(err);
    }
    if(!data.content){
      err = AppError.error400('bad request');
      return reject(err);
    }

    Note.findOne({_id: id})
   .then(note => {
     Note.update({_id: id}, data)
     .then(() => {
       Note.findOne({_id: id})
       .then(resolve)
       .catch(reject);
     })
     .catch( err => reject(AppError.error400(err.mesage)));
   })
   .catch(err => reject(AppError.error404(err.message)));
  });
};
exports.removeNote = function(id){
  return new Promise((resolve, reject) => {
    Note.findOne({_id: id})
    .then(()=>{
      Note.remove({_id: id})
      .then(resolve)
      .catch(err => reject(AppError.error500(err.message)));
    })
    .catch(err => reject(AppError.error404(err.message)));

  });
};
exports.removeAllNotes=function(){
  return Note.remove({});
};
