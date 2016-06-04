'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const playerCrud = require('../lib/player-crud');
const playerRouter = module.exports = new Router();

playerRouter.post('/player', jsonParser, (req, res) => {
  playerCrud.createPlayer(req.body)
  .then(player => res.send(player))
  .catch(err => res.sendError(err));
});

playerRouter.get('player/:id', (req, res) => {
  playerCrud.fetchPlayer(req.params.id)
  .then(player => res.send(player))
  .catch(err => res.sendError(err));
});
