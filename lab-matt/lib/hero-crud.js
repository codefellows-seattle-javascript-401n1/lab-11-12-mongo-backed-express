'use strict';

const Hero = require('../model/hero');
const AppErr = require('../lib/app-error');
const debug = require('debug')('hq:hero-crud');

exports.createHero = function(reqBody){
  debug('hit createHero');
  return new Promise((resolve, reject) => {
    if(! reqBody.content) {
      return reject(AppErr.error400('hero requires content'));
    }
    if(! reqBody.name) {
      return reject(AppErr.error400('hero requires name'));
    }
    reqBody.timestamp = new Date();
    const hero = new Hero(reqBody);
    hero.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchHero = function(id){
  debug('hit fetchHero');
  return new Promise((resolve, reject) => {
    Hero.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.deleteHero = function(id){
  debug('hit deleteHero');
  return new Promise((resolve, reject) => {
    Hero.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppErr.error404(err.message)));
  });
};

exports.removeAllHeroes = function(){
  return Hero.remove({});
};
