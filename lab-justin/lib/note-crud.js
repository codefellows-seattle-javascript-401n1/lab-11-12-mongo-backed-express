'use strict';

const Note = require('../model/note');
const AppErr = require('../lib/app-error');
const debug = require('debug')('justin:note-crud');

exports.createNote = function(reqBody){
  return new Promise((resolve, reject) => {
    if (!reqBody.content)
      return reject(AppErr.error400('note require\'s content'));
    if(!reqBody.name)
      return reject(AppErr.error400('note require\'s name'));

    reqBody.timestamp = new Date();
    const note = new Note(reqBody);
    note.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchNote = function(id){
  return new Promise((resolve, reject) => {
    // debugger;
    Note.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeAllNotes = function(){
  return Note.remove({});
};
//

exports.deleteNote = function(id){
  debug('note-deleteNote');

  return new Promise((resolve, reject) => {
    Note.findOne({_id: id})
    .then((note) => {
      note.remove(note)
      .then(note => resolve(note))
      .catch(note => reject(note));

    }).catch( err => reject(AppErr.error404(err.message)));
  });
};

exports.updateNote = function(id, newUpdatedBody){
  debug('note-updateNote');

  return new Promise((resolve, reject) => {
    if(!newUpdatedBody)
      return reject(AppErr.error400('note require\'s content'));
    if(!id)
      return reject(AppErr.error400('note require\'s id'));

    Note.findOne({_id: id})
    .then((note) => {
      if(newUpdatedBody.name){
        note.name = newUpdatedBody.name;
      }
      if(newUpdatedBody.content){
        note.content = newUpdatedBody.content;
      }
      note.save()
      .then(resolve)
      .catch(reject);
    })
    .catch((err) => {
      reject(AppErr.error404(err.message));
    });
  });
};
