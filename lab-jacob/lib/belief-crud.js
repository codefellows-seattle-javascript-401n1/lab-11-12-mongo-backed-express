'use strict';

const debug = require('debug')('deity:task-crud');

const Belief = require('../model/belief');
const deityCrud = require('./deity-crud');
const AppError = require('../lib/app-error');

exports.createBelief = function(reqBody){ // creates the beliefs
  debug('belief-createBelief');
  return new Promise((resolve, reject) => {
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

exports.fetchBeliefByDeityId = function(deityId){ // fetches our beliefs from the database
  debug('fetchBelief');
  return new Promise((resolve, reject) => {
    deityCrud.fetchDeity({_id: deityId})
    .then( deity => Belief.findOne({deityId: deity._id}))
    .then( belief => resolve(belief))
    .catch( err => reject(err));
  });
};

// using deityId to select belief
exports.updateBeliefByDeityId = function(deityId, updateContent){ // function to update our beliefs
  debug('belief-updateCrud');
  return new Promise((resolve, reject) => {
    if(!updateContent.name && !updateContent.desc) {
      return reject(AppError.error400('bad request'));
    }
    if(!deityId) {
      return reject(AppError.error400('bad request'));
    }
    deityCrud.fetchDeity({_id: deityId})
    .then( deity => Belief.findOne({deityId: deity._id}))
    .then((belief) => {
      if(updateContent.name){
        belief.name = updateContent.name;
      }
      if(updateContent.desc) {
        belief.desc = updateContent.desc;
      }
      belief.save()
      .then( belief => resolve(belief))
      .catch( err => reject(err));
    }).catch((err) => {
      reject(AppError.error404(err.message));
    });
  });
};

exports.deleteBeliefByDeityId = function(id) { //destroy function for beliefs
  debug('belief-deleteBelief');
  return new Promise((resolve, reject) => {
    deityCrud.fetchDeity({_id: id})
    .then( deity => Belief.findOne({id: deity._id}))
    .then((belief) => {
      Belief.remove(belief)
      .then( belief => resolve(belief))
      .catch( belief => reject(belief));
    }).catch( err =>
    reject(AppError.error404(err.message)));
  });
};

exports.removeAllBeliefs = function(){
  return Belief.remove({});
};
