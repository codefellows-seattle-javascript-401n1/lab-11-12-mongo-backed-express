'use strict';

const Router = require('express').Router;
const debug = require('debug')('awesomeNote:task-router');
const jsonParser = require('body-parser').json();
const noteCrud = require('../lib/note-crud');
const noteRouter = module.exports = new Router();

noteRouter.post('/note', jsonParser, function(req, res){
  debug('noteRouter Post');
  noteCrud.createNote(req.body)
  .then( note => res.send(note))
  .catch( err => res.sendError(err));
});
