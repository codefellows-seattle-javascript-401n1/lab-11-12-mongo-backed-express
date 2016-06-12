'use strict';

// const debug = require('debug')('brewer:brew-crud');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Brew = require('../model/brew');
const brewerCrud = require('./brewer-crud');
const AppError = require('./app-error');

exports.createBrew = function(reqBody){
  return new Promise((resolve, reject) => {
    if(!reqBody.brewerId)
      return reject(AppError.error400('brew requires BrewerId'));
    if(!reqBody.desc)
      return reject(AppError.error400('brew requires a description'));
    const brew = new Brew(reqBody);
    brew.save()
    .then(brew => resolve(brew))
    .catch(err => reject(err));
  });
};

exports.deleteBrew = function(id) {
  return new Promise((resolve, reject) => {
    Brew.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.fetchBrew = function(id) {
  return new Promise((resolve, reject) => {
    Brew.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};


exports.fetchBrewByBrewerId = function(brewerId) {
  return new Promise((resolve, reject) => {
    brewerCrud.fetchBrewer({_id: brewerId})
    .then(brewer => Brew.find({brewerId: brewer._id}))
    .then(brew => resolve(brew))
    .catch(err => reject(err));
  });
};

exports.removeAllBrews = function() {
  return Brew.remove({});
};
