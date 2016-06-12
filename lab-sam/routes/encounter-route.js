'use strict';
const Router = require('express').Router;
const debug = require('debug')('dm:encounterRoute');
const jsonParser = require('body-parser').json();

const AppError = require('../lib/app-error');
const encounterCrud = require('../lib/encounter-crud');
const npcCrud = require('../lib/npc-crud');

const encounterRoute = module.exports = new Router;

encounterRoute.post('/encounter', jsonParser, function(req, res){
  debug('encounter POST route');
  encounterCrud.createEncounter(req.body)
  .then( encounter => res.send(encounter))
  .catch( err => res.sendError(err))
});

encounterRoute.get('/encounter/:id', function
(req, res){
  encounterCrud.fetchEncounter(req.params.id)
  .then(encounter => res.send(encounter))
  .catch(err => res.sendError(err));
});

encounterRoute.get('/encounter/:id/npcs', function(req, res){
  debug('encounter GET all NPCs route');
  npcCrud.fetchNpcByEncounter(req.params.id)
  .then(npcs => res.send(npcs))
  .catch(err => res.sendError(err));
});

encounterRoute.put('/encounter/:id', jsonParser, function(req, res){
  encounterCrud.updateEncounter(req.params.id, req.body)
  .then( encounter => res.send(encounter) )
  .catch( err => res.sendError(err) );
});

encounterRoute.delete('/encounter/:id', function(req, res){
  console.log('delete route id is', req.params.id);
  encounterCrud.removeEncounter(req.params.id)
  .then((whatIsThis) => {
    console.log('Inside delete route: ', whatIsThis);
    res.status(204).send(whatIsThis);
  })
  .catch(err => res.sendError(err));
});
