'use strict';

const Router = require('express').Router;
const debug = require('debug')('awesomeNote:task-router');
const jsonParser = require('body-parser').json();
const sendError = require('../lib/error-response');
const noteCrud = require('../lib/note-crud');
const noteRouter = module.exports = new Router();

noteRouter.post('/note', jsonParser, function(req, res){
  debug('noteRouter Post');
  noteCrud.createNote(req.body)
  .then( note => res.send(note))
  .catch( err => res.sendError(err));
});

noteRouter.get('/note/:id', sendError, function(req, res){
  debug('noteRouter Get');
  noteCrud.fetchNoteByUserId(req.params.id)
  .then(note => res.send(note))
  .catch(err => res.sendError(err));
});

noteRouter.put('/note/:id', jsonParser, sendError, function(req, res){
  debug('noteRouter PUT');
  noteCrud.updateNote(req.params.id, req.body)
  .then(user => res.send(user))
  .catch(err => res.sendError(err));
});
