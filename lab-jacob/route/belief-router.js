'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const beliefCrud = require('../lib/belief-crud');

const beliefRouter = module.exports = new Router();

beliefRouter.post('/belief', jsonParser, function(req, res){
  console.log('belief post router');
  beliefCrud.createBelief(req.body)
  .then( belief => res.send(belief))
  .catch( err => res.sendError(err));
});
