'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const brewCrud = require('../lib/brew-crud');
const brewRouter = module.exports = new Router();

brewRouter.post('/brew', jsonParser, function(req, res) {
  brewCrud.createTask(req.body)
  .then(brew => res.send(brew))
  .catch(err => res.sendError(err));
});
