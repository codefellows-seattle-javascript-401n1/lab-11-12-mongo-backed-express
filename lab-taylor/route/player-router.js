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
  .then(player => {
    res.send(player);
  })
  .catch(err => res.errorResponse(err));
});
