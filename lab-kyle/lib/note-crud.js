'use strict';

const Note = require('../model/note');
const AppErr = require('../lib/app-error');
const debug = require('debug')('awesomeNote:note-crud');
const userCrud = require('./user-crud');

exports.createNote = function(reqBody){
  debug('note-crud createNote');
  return new Promise((resolve, reject) => {
    if (! reqBody.content)
      return reject(AppErr.error400('note require\'s content'));
    if(! reqBody.name)
      return reject(AppErr.error400('note require\'s name'));

    reqBody.timestamp = new Date();
    const note = new Note(reqBody);
    note.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchNoteByUserId = function(userId){
  debug('note-crud fetchNoteByUserId');
  return new Promise((resolve, reject) => {
    userCrud.fetchUser({_id: userId})
    .then( note => Note.find({userId: note._id}))
    .then( notes => resolve(notes))
    .catch( err => reject(err));
  });
};

exports.updateNote = function(id, data){
  return new Promise((resolve, reject) => {
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

    Note.findOne({_id: id})
    .then(() => {
      Note.update({_id: id}, data)
      .then(() => {
        Note.findOne({_id: id})
        .then(resolve)
        .catch(reject);
      })
     .catch( err => reject(AppErr.error400(err.mesage)));
    })
   .catch(err => reject(AppErr.error404(err.message)));
  });
};


exports.removeAllNotes = function(){
  debug('note-crud removeAllNotes');
  return Note.remove({});
};
