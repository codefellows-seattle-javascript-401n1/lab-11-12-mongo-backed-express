'use strict';

const debug = require('debug')('deity:task-crud');

const Belief = require('../model/belief');
// const deityCrud = require('./deity-crud');
const AppError = require('../lib/app-error');

exports.createBelief = function(reqBody){
  debug('belief-createBelief');
  return new Promise((resolve, reject) => {
    console.log('belief create');
    if(!reqBody.deityId)
      return reject(AppError.error400('belief requires a name'));
    if(!reqBody.desc || !reqBody.name)
      return reject(AppError.error400('belief requires a description and name'));
    const belief = new Belief(reqBody);
    belief.save()
    .then(belief => resolve(belief))
    .catch(err => reject(err));
  });
};

exports.removeAllBeliefs = function(){
  return Belief.remove({});
};
