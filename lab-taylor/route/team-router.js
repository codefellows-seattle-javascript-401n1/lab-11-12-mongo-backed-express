'use strict';

const Router = require('express').Router;
const debug = require('debug')('soccer:team-router');
const jsonParser = require('body-parser').json();
const teamCrud = require('../lib/team-crud');
const playerCrud = require('../lib/player-crud');
const teamRouter = module.exports = new Router();

teamRouter.post('/team', jsonParser, (req, res) => {
  debug('posting team');
  teamCrud.createTeam(req.body)
  .then(team => res.send(team))
  .catch(err => res.errorResponse(err));
});

teamRouter.get('/team/:id', (req, res) => {
  debug('getting team');
  teamCrud.fetchTeam(req.params.id)
  .then(team => res.send(team))
  .catch(err => res.errorResponse(err));
});

teamRouter.put('/team/:id', jsonParser, (req, res) => {
  debug('putting team update');
  teamCrud.updateTeam(req.params.id, req.body)
  .then(team => res.send(team))
  .catch(err => res.errorResponse(err));
});

teamRouter.delete('/team/:id', (req, res) => {
  debug('deleting team');
  teamCrud.removeTeam(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => res.errorResponse(err));
});

teamRouter.get('/team/:id/players', (req, res) => {
  playerCrud.fetchPlayerByTeamId(req.params.id)
  .then(players => res.send(players))
  .catch(err => res.send(err));
});
