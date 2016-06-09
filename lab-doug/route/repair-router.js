'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('business:repair-router');
const repairCrud = require('../lib/repair-crud');
const repairRouter = module.exports = new Router();


repairRouter.post('/repair', bodyParser, function(req, res){
  repairCrud.createRepair(req.body)
    //for fat arrow functions that do not have{}, the value on the right is implicitly returned
    .then (repair => res.send(repair))
    .catch(err => res.sendError(err));
});
