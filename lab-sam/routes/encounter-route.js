'use strict';
const Router = require('express').Router;
const debug = require('debug')('dm:encounterRoute');
const jsonParser = require('body-parser').json();

const AppError = require('../lib/app-error');
const encounterCrud = require('../lib/encounter-crud');
const NPCCrud = require('../lib/npc-crud');

const encounterRoute = module.exports = new Router;

encounterRoute.post('/encounter', jsonParser, function(req, res){
  debug('encounter POST route');
  encounterCrud.createEncounter(req.body)
  .then( encounter => res.send(encounter))
  .catch( err => res.sendError(err))
});

encounterRoute.get('encounter/:id', function(req, res){
  encounterCrud.fetchEncounter(req.params.id)
  .then(encounter => res.send(encounter))
  .catch(err => res.sendError(err));
});

// encounterRoute.delete('encounter/:id', function(req, res){
//   remove encounter(req.params.id)
//   .then(encounter => res.send(encounter))
//   .catch(err => res.sendError(err));
// });
