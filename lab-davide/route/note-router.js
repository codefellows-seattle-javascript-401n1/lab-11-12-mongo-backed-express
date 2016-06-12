'use strict';
//node modules
//npm modules
//app modules
//global

//we are requiring the Router function from the express module//
const Router = require('express').Router;
// const debug = require('debug')('note:note-router');
const JsonParser = require('body-parser').json();


const noteCrud = require('../lib/note-crud');


const noteRouter = module.exports = new Router();


//adding POST request//
noteRouter.post('/note', JsonParser, function(req, res) {
  noteCrud.createNote(req.body)
  .then(note => res.send(note))
  .catch(err => res.sendError(err));
});

// adding GET request//
noteRouter.get('note/:id', function(req, res) {
  console.log('calling get');
  noteCrud.fetchNote(req.params.id)
  .then(note => res.send(note))
  .catch(err => res.sendError(err));

});

//adding PUT request//
noteRouter.put('note/:id', JsonParser, function(req, res) {
  console.log('calling put');
  noteCrud.updateNote(req.params.id, req.body)
  .then(note => res.send(note))
  .catch(err => res.sendError(err));

});


//adding DELETE request//
noteRouter.delete('note/:id', function(req, res) {
  console.log('calling delete');
  noteCrud.deleteNote(req.params.id)
  .then(note => res.send(note))
  .catch(err => res.sendError(err));

});
