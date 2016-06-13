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
    const newNote = new Note(reqBody);
    newNote.save(); //save on 'note' objects, not 'Note' constructor
    resolve(newNote);
  });
};

exports.fetchNote = function(id){
  debug('fetching Note');
  return new Promise((resolve, reject) =>{
    //Look up object with 'id'
    Note.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeAllNotes = function(){
  return Note.remove({});
};
