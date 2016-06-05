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
    .then( tasks => resolve(tasks))
    .catch( err => reject(err));
  });
};

exports.removeAllNotes = function(){
  debug('note-crud removeAllNotes');
  return Note.remove({});
};
