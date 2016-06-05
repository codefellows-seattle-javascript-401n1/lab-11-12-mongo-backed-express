'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const userCrud = require('../lib/user-crud');
const noteCrud = require('../lib/note-crud');
const taskCrud = require('../lib/task-crud');

const debug = require('debug')('USER_ROUTER');

const userRouter = module.exports = new Router();

userRouter.post('/user', jsonParser, function(req, res){
  debug('create User /POST Route');
  userCrud.createUser(req.body)
  .then( note => res.send(note))
  .catch( err => res.sendError(err));
});

userRouter.get('user/note/:id', function(req, res){
  noteCrud.fetchNote(req.params.id)
  .then(note => res.send(note))
  .catch(err => res.sendError(err));
});

userRouter.get('user/note/:id/tasks', function(req, res){
  taskCrud.fetchTaskByNoteId(req.params.id)
  .then(tasks => res.send(tasks))
  .catch(err => res.sendError(err));
});
