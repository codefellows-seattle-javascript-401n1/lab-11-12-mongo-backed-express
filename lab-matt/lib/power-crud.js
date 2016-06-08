'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Power = require('../model/power');
const heroCrud = require('./hero-crud');
const AppError = require('./app-error');
const debug = require('debug')('hq:power-crud');

exports.createPower = function(reqBody){
  return new Promise((resolve, reject)=>{
    if(! reqBody.heroId) {
      return reject(AppError.error400('tasks require noteId'));
    }
    if(! reqBody.power) {
      return reject(AppError.error400('powers require a description'));
    }
    const power = new Power(reqBody);
    power.save()
    .then(power => resolve(power))
    .catch(err => reject(err));
  });
};

exports.deletePower = function(id){
  debug('hit deletePower');
  return new Promise((resolve, reject) => {
    Power.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.fetchPower = function(id){
  return new Promise((resolve, reject) => {
    Power.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.fetchPowerByHeroId = function(heroId){
  return new Promise((resolve, reject) => {
    heroCrud.fetchHero({_id: heroId})
    .then( hero => Power.find({heroId: hero._id}))
    .then( powers => resolve(powers))
    .catch(err => reject(err));
  });
};

exports.removeAllPowers = function(){
  return Power.remove({});
};
