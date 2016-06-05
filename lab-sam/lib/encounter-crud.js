'use strict';

const Encounter = require('../model/encounter');
const AppError = require('./app-error');
const debug = require('debug')('dm:encounter-crud');

exports.createEncounter = function(reqBody){
  debug('createEncounter');
  return new Promise ((resolve, reject ) => {
    if (! reqBody.description)
      return reject(AppError.error400('encounters require a description'));
    if (! reqBody.name)
      return reject(AppError.error400('encounters require a name'));
    if (! reqBody.cr)
      return reject(AppError.error400('encounters require a challenge rating'));
    const encounter = new Encounter(reqBody);
    encounter.save()
    .then(encounter => resolve(encounter))
    .catch(err => reject(err));
  });
};

exports.fetchEncounter = function(id){
  return new Promise((resolve, reject) =>{
    Encounter.findOne({_id: id})
    .then(encounter => resolve(encounter))
    .catch(err => AppError.error404(err.message));
  });
};

exports.removeEncounter = function(id){
  return Encounter.remove({_id: id});
};

exports.removeAllEncounters = function(){
  return Encounter.remove({});
};
