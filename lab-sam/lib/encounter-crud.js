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
  debug('fetchEncounter');
  return new Promise((resolve, reject) => {
    Encounter.findOne({_id: id})
    .then(encounter => resolve(encounter))
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.updateEncounter = function(id, reqBody){
  debug('updateEncounter');
  return new Promise ((resolve, reject) => {
    if (! id)
      return reject(AppError.error400('encounters require a name'));
    Encounter.findOne({_id: id})
      .then((encounter) => {
        console.log('PUT old', encounter);
        if (reqBody.description) {
          encounter.description = reqBody.description;
        }
        if (reqBody.name) {
          encounter.name = reqBody.name;
        }
        if (reqBody.cr) {
          encounter.cr = reqBody.cr;
        }
        if (reqBody.extra) {
          encounter.extra = reqBody.extra;
        }
        console.log('after IFs encounter =', encounter);
        encounter.save();
        resolve(encounter);
      })
      .then(encounter => resolve(encounter))
      .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.removeEncounter = function(id){
  debug('fetchEncounter');
  return new Promise((resolve, reject) => {
    console.log('removeEncounter hit');
    Encounter.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.removeAllEncounters = function(){
  return Encounter.remove({});
};
