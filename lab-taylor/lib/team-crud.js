'use strict';

const debug = require('debug')('soccer:team-crud');
const Team = require('../model/team');
const AppError = require('./AppError');

exports.createTeam = function(reqBody) {
  debug('creating team');
  return new Promise((resolve, reject) => {
    if (!reqBody.name) return reject(AppError.error400('teams require a name'));
    if (!reqBody.city) return reject(AppError.error400('teams require a city'));
    if (!reqBody.coach) return reject(AppError.error400('teams require a coach'));

    reqBody.timestamp = new Date();
    const team = new Team(reqBody);
    team.save()
    .then(resolve)
    .catch(reject);
  });
};

exports.fetchTeam = function(id) {
  debug('fetching team');
  return new Promise((resolve, reject) => {
    Team.findOne({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};


exports.updateTeam = function(id, reqBody) {
  debug('updating team');
  return new Promise((resolve, reject) => {
    if (Object.keys(reqBody).length === 0) return reject(AppError.error400('need to provide a body'));

    const teamKeys = ['name', 'city', 'coach'];
    Object.keys(reqBody).forEach((key) => {
      if (teamKeys.indexOf(key) === -1) return reject(AppError.error400('need to update a key that exists'));
    });

    Team.findByIdAndUpdate(id, reqBody)
    .then(() => Team.findOne({_id: id}).then(resolve))
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.removeTeam = function(id) {
  debug('removing team');
  return new Promise((resolve, reject) => {
    Team.remove({_id: id})
    .then(resolve)
    .catch(err => reject(AppError.error404(err.message)));
  });
};

exports.removeAllTeams = function() {
  debug('deleting all players');
  return Team.remove({});
};
