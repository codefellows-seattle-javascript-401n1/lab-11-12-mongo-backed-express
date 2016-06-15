'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const sendError = require('../lib/error-response');
const userCrud = require('../lib/user-crud');
const noteCrud = require('../lib/note-crud');

const debug = require('debug')('USER_ROUTER');

const userRouter = module.exports = new Router();

userRouter.post('/user', jsonParser, sendError, function(req, res){
  debug('create User /POST Route');
  userCrud.createUser(req.body)
  .then( user => res.send(user))
  .catch( err => res.sendError(err));
});

userRouter.get('/user/:id', sendError, function(req, res){
  userCrud.fetchUser(req.params.id)
  .then(user => res.send(user))
  .catch(err => res.sendError(err));
});

userRouter.put('/user/:id', jsonParser, sendError, function(req, res){
  userCrud.updateUser(req.params.id, req.body)
  .then(user => res.send(user))
  .catch(err => res.sendError(err));
});

userRouter.delete('/user/:id', jsonParser, sendError, function(req, res){
  userCrud.removeOneUser(req.params.id)
  .then(() => res.status(204).end())
  .catch(err => res.sendError(err));
});

userRouter.get('/user/:id/note', function(req, res){
  noteCrud.fetchNoteByUserId(req.params.id)
  .then(notes => res.send(notes))
  .catch(err => res.sendError(err));
});
