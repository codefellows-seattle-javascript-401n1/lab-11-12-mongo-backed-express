'use strict';

const NPC = require('../model/npc');
const encounterCrud = require('./encounter-crud');
const AppError = require('./app-error');
const debug = require('debug')('dm:npc-crud');

exports.createNpc = function(reqBody){
  debug('createNpc')
  return new Promise ((resolve, reject ) => {
    if (! reqBody.encounterId)
      return reject(AppError.error400('npcs must be linked to an encounter'));
    if (! reqBody.classes)
      return reject(AppError.error400('npcs requires at least one class'));
    if (! reqBody.race)
      return reject(AppError.error400('npcs require a race'));
    if (! reqBody.name)
      return reject(AppError.error400('npcs require a name'));
    const npc = new NPC(reqBody);
    NPC.save()
    .then(npc => resolve(npc))
    .catch(err => reject(err));
  });
};

exports.fetchNpcByEncounter = function(encounterId){
  debug('fetchNpcByEncounter')
  return new Promise((resolve, reject) =>{
    encounterCrud.fetchEncounter({_id: encounterId})
    .then( encounter => NPC.find({encounterId: encounter._id}))
    .then( npc => resolve(npc))
    .catch( err => reject(err));
  });
};

exports.removeAllNPCs = function(){
  debug('removeAllNPCs')
  return NPC.remove({});
};
