'use strict';

const NPC = require('../model/npc');
const encounterCrud = require('./encounter-crud');
const AppError = require('./app-error');
const debug = require('debug')('dm:npc-crud');

exports.createNpc = function(reqBody){
  debug('createNpc');
  return new Promise ((resolve, reject ) => {
    console.log('^^^^^^createNpc; reqBody', reqBody);
    if (!reqBody.encounterId)
      return reject(AppError.error400('npcs must be linked to an encounter'));
    if (!reqBody.classes)
      return reject(AppError.error400('npcs requires at least one class'));
    if (!reqBody.race)
      return reject(AppError.error400('npcs require a race'));
    if (!reqBody.name)
      return reject(AppError.error400('npcs require a name'));
    const npc = new NPC(reqBody);
    npc.save()
    .then(npc => resolve(npc))
    .catch(err => reject(err));
  });
};

exports.updateNpc = function(id, reqBody){
  debug('updateNpc');
  console.log('updateNpc: reqBody', reqBody);
  return new Promise ((resolve, reject) => {
    if (! reqBody.encounterId) {
      console.log('ERROR found ! reqBody.encounterId HIT');
      return reject(AppError.error400('npcs must be linked to an encounter'));
    }
    console.log('updateNpc good; reqBody.encounterId');
    encounterCrud.fetchEncounter(reqBody.encounterId)
    .then( () => {
      NPC.findOne({_id: id})
      .then( npc => {
        console.log('found npc: ', npc);
        if (reqBody.race) {
          npc.race = reqBody.race;
        }
        if (reqBody.name) {
          npc.name = reqBody.name;
        }
        if (reqBody.classes) {
          npc.classes = reqBody.classes;
        }
        if (reqBody.extra) {
          npc.extra = reqBody.extra;
        }
        npc.save()
        .then(npc => resolve(npc))
        .catch(err => reject(AppError.error404(err.message)));
      })
      .catch(err => reject(AppError.error404(err.message)));
    })
    .catch(err => reject(AppError.error404(err.message)));
  });

};
//
// exports.fetchNpc = function(id){
//   debug('fetchNpc');
//   return new Promise((resolve, reject) => {
//     npc.findOne({_id: id})
//     .then(encounter => resolve(encounter))
//     .catch(err => reject(AppError.error404(err.message)));
//   });
// };

exports.fetchNpcByEncounter = function(encounterId){
  debug('fetchNpcByEncounter');
  return new Promise((resolve, reject) =>{
    encounterCrud.fetchEncounter({_id: encounterId})
    .then( encounter => NPC.find({encounterId: encounter._id}))
    .then( npcs => resolve(npcs))
    .catch( err => reject(err));
  });
};

exports.removeAllNPCs = function(){
  debug('removeAllNPCs');
  return NPC.remove({});
};
