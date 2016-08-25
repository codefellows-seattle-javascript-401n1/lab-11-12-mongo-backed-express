'use strict';

const Note = require('../model/note');
const AppErr = require('../lib/app-error');
const debug = require('debug')('rito:note-crud');

exports.createNote = function(reqBody){
  return new Promise((resolve, reject) =>{
    if(!reqBody.content)
      return reject(AppErr.error400('note require\'s content'));
    if(!reqBody.name)
      return reject(AppErr.error400('note require\'s name'));

    reqBody.timestamp = new Date();
    const note = new Note(reqBody);
    note.save() //save on 'note' objects, not 'Note' constructor
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchNoteByNoteId = function(id){
  debug('fetchNote');
  return new Promise((resolve, reject) =>{
    Note.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.updateNote = function(id, data){
  debug('updateNote');
  return new Promise((resolve, reject)=> {
    if(!id){
      var err = AppErr.error400('bad request');
      return reject(err);
    }
    if(!data){
      err = AppErr.error400('bad request');
      return reject(err);
    }
    if(!data.content){
      err = AppErr.error400('bad request');
      return reject(err);
    }
    Note.findOne({_id:id})
    .then(()=>{
      Note.update({_id:id},data)
      .then(()=>{
        Note.findOne({_id:id})
        .then(resolve)
        .catch(reject);
      })
      .catch(err => reject(AppErr.error400(err.message)));
    })
    .catch(err => reject(AppErr.error404(err.message)));
  });
};
exports.removeNote = function(id){
  return new Promise((resolve, reject)=> {
    Note.findOne({_id:id})
    .then(()=>{
      Note.remove({_id:id})
      .then(() => {
        resolve();
      })
      .catch(err => reject(AppErr.error500(err.message)));
    })
    .catch(err => reject(AppErr.error404(err.message)));
  });
};
exports.removeAllNotes = function(){
  return Note.remove({});
};
