'use strict';

const Router = require('express').Router;
const debug = require('debug')('soccer:player-router');
const jsonParser = require('body-parser').json();
const playerCrud = require('../lib/player-crud');
const playerRouter = module.exports = new Router();

playerRouter.post('/player', jsonParser, (req, res) => {
  debug('posting player');
  playerCrud.createPlayer(req.body)
  .then(player => res.send(player))
  .catch(err => res.errorResponse(err));
});

playerRouter.get('/player/:id', (req, res) => {
  debug('getting player');
  playerCrud.fetchPlayer(req.params.id)
  .then(player => res.send(player))
  .catch(err => res.errorResponse(err));
});

playerRouter.put('/player/:id', jsonParser, (req, res) => {
  debug('putting player update');
  playerCrud.updatePlayer(req.params.id, req.body)
  .then(player => res.send(player))
  .catch(err => res.errorResponse(err));
});

playerRouter.delete('/player/:id', (req, res) => {
  debug('deleting player');
  playerCrud.removePlayer(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => res.errorResponse(err));
});
