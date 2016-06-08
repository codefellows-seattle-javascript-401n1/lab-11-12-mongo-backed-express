'use strict';
const Router = require('express').Router;
const debug = require('debug')('dm:encounterRoute');
const jsonParser = require('body-parser').json();

const AppError = require('../lib/app-error');
const encounterCrud = require('../lib/encounter-crud');
const NPCCrud = require('../lib/npc-crud');

const npcRoute = module.exports = new Router;

npcRoute.post('/npc', jsonParser, function(req, res){
  debug('npc POST route');
  npcCrud.createnpc(req.body)
  .then( npc => res.send(npc))
  .catch( err => res.sendError(err))
});

npcRoute.get('/npc/:id', function(req, res){
  npcCrud.fetchnpc(req.params.id)
  .then(npc => res.send(npc))
  .catch(err => res.sendError(err));
});

npcRoute.put('/npc/:id', jsonParser, function(req, res){
  npcCrud.updateNpc(req.params.id, req.body)
  .then( npc => res.send(npc) )
  .catch( err => res.sendError(err) );
});

npcRoute.delete('/npc/:id', function(req, res){
  console.log('delete route id is', req.params.id);
  npcCrud.removenpc(req.params.id)
  .then((whatIsThis) => {
    console.log('Inside delete route: ', whatIsThis);
    res.status(204).send(whatIsThis);
  })
  .catch(err => res.sendError(err));
});
