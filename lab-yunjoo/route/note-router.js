'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const noteCrud = require('../lib/note-crud');
// const taskCrud = require('../lib/task-crud');
const noteRouter = module.exports = new Router();
const sendError = require('../lib/error-response');

noteRouter.post('/note', jsonParser, sendError, function(req, res){
  noteCrud.createNote(req.body)
  .then(note => res.send(note))
  .catch(err => res.sendError(err));
});

noteRouter.get('/note/:id', jsonParser, sendError, function(req, res){
  noteCrud.fetchNoteByNoteId(req.params.id)
  .then(note => res.send(note))
  .catch(err => res.sendError(err));
});

noteRouter.get('/note/:id/tasks', sendError,function(req, res){
  noteCrud.fetchNoteByNoteId(req.params.id)
  .then(tasks => res.send(tasks))
  .catch(err => res.sendError(err));
});

noteRouter.put('/note/:id', jsonParser, sendError, function(req, res){
  noteCrud.updateNote(req.params.id, req.body)
  .then(note => res.send(note))
  .catch(err => res.sendError(err));
});

noteRouter.delete('/note/:id', sendError, function(req, res){
  noteCrud.removeNote(req.params.id)
  .then(() => res.status(204).end())
  .catch(err => res.sendError(err));
});
