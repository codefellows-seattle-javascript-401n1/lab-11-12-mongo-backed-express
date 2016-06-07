'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const server = require('../server');
const teamCrud = require('../lib/team-crud');
const playerCrud = require('../lib/player-crud');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;

request.use(superPromise);

describe('testing module team-router', function() {
  before((done) => {
    if (!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if (server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        done();
      });
    }
  });

  describe('testing POST /api/team', function() {
    after((done) => {
      teamCrud.removeAllTeams()
      .then(() => done())
      .catch(done);
    });

    it('should return a team with valid data', function(done) {
      request.post(`${baseUrl}/api/team`)
      .send({
        name: 'Seattle Sounders',
        city: 'Seattle',
        coach: 'Sigi'
      })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal('Seattle Sounders');
      done();
    })
    .catch(done);
    });

    it('should return a 400 when no body is provided', (done) => {
      request.post(`${baseUrl}/api/team/`)
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        expect(err.response.error.text).to.equal('bad request');
        done();
      });
    });

    it('should return a 400 when invalid body is provided', (done) => {
      request.post(`${baseUrl}/api/team/`)
      .send({
        name: 'Seattle Sounders FC'
      })
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        expect(err.response.error.text).to.equal('bad request');
        done();
      });
    });
  });

  describe('testing GET /api/team', function() {
    let tempTeam = {};
    before((done) => {
      teamCrud.createTeam({
        name: 'Seattle Sounders',
        city: 'Seattle',
        coach: 'Sigi'
      })
      .then((team) => {
        tempTeam = team;
        done();
      })
      .catch(done);
    });

    after((done) => {
      teamCrud.removeAllTeams()
      .then(() => done())
      .catch(done);
    });

    it('should return a team when a valid id', (done) => {
      request.get(`${baseUrl}/api/team/${tempTeam._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Seattle Sounders');
        done();
      })
      .catch(done);
    });

    it('should return an error 404 with invalid id', (done) => {
      request.get(`${baseUrl}/api/team/3923`)
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        expect(err.response.error.text).to.equal('not found');
        done();
      });
    });
  });

  describe('testing PUT /api/team', function() {
    let tempTeam = {};
    before((done) => {
      teamCrud.createTeam({
        name: 'Seattle Sounders',
        city: 'Seattle',
        coach: 'Sigi'
      })
      .then((team) => {
        tempTeam = team;
        done();
      })
      .catch(done);
    });

    after((done) => {
      teamCrud.removeAllTeams()
      .then(() => done())
      .catch(done);
    });

    it('should return a team when a valid id', (done) => {
      request.put(`${baseUrl}/api/team/${tempTeam._id}`)
      .send({
        name: 'NEW NAME'
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('NEW NAME');
        done();
      })
      .catch(done);
    });

    it('should return a 404 if an invalid id is provided', (done) => {
      request.put(`${baseUrl}/api/team/23432`)
      .send({
        name: 'New Name'
      })
      .catch((err) => {
        expect(err.response.error.status).to.equal(404);
        expect(err.response.error.text).to.equal('not found');
        done();
      });
    });

    it('should return a 400 if no body is provided', (done) => {
      request.put(`${baseUrl}/api/team/${tempTeam._id}`)
      .catch((err) => {
        expect(err.response.error.status).to.equal(400);
        expect(err.response.error.text).to.equal('bad request');
        done();
      });
    });

    it('should return a 400 if invalid body is provided', (done) => {
      request.put(`${baseUrl}/api/team/${tempTeam._id}`)
      .send({
        fake_key: 'you suck'
      })
      .catch((err) => {
        expect(err.response.error.status).to.equal(400);
        expect(err.response.error.text).to.equal('bad request');
        done();
      });
    });
  });

  describe('testing DELETE /api/team/:id', function() {
    let tempTeam = {};
    before((done) => {
      teamCrud.createTeam({
        name: 'Seattle Sounders',
        city: 'Seattle',
        coach: 'Sigi'
      })
      .then((team) => {
        tempTeam = team;
        done();
      })
      .catch(done);
    });

    after((done) => {
      teamCrud.removeAllTeams()
      .then(() => done())
      .catch(done);
    });

    it('should return 204 with a valid id', (done) => {
      request.del(`${baseUrl}/api/team/${tempTeam._id}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });

    it('should return an error 404 with invalid id', (done) => {
      request.del(`${baseUrl}/api/team/3923`)
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        expect(err.response.error.text).to.equal('not found');
        done();
      });
    });
  });

  describe('GET /api/team/:id/players with valid id', function() {
    before((done) => {
      teamCrud.createTeam({
        name: 'Seattle Sounders',
        city: 'Seattle',
        coach: 'Sigi'
      })
         .then((team) => {
           this.tempTeam = team;
           return Promise.all([
             playerCrud.createPlayer({
               teamId: team._id,
               name: 'player 1',
               hometown: 'city 1',
               position: 'position 1',
               number: 1
             }),
             playerCrud.createPlayer({
               teamId: team._id,
               name: 'player 2',
               hometown: 'city 2',
               position: 'position 2',
               number: 2
             }),playerCrud.createPlayer({
               teamId: team._id,
               name: 'player 3',
               hometown: 'city 3',
               position: 'position 3',
               number: 3
             }),playerCrud.createPlayer({
               teamId: team._id,
               name: 'player 4',
               hometown: 'city 4',
               position: 'position 4',
               number: 4
             }),playerCrud.createPlayer({
               teamId: team._id,
               name: 'player 5',
               hometown: 'city 5',
               position: 'position 5',
               number: 5
             })
           ]);
         })
         .then(tasks => {
           this.tempTasks = tasks;
           done();
         })
         .catch(done);
    });

    after((done) => {
      Promise.all([
        playerCrud.removeAllPlayers(),
        teamCrud.removeAllTeams()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return an array of six players', (done) => {
      request.get(`${baseUrl}/api/team/${this.tempTeam._id}/players`)
         .then((res) => {
           expect(res.status).to.equal(200);
           expect(res.body.length).to.equal(5);
           done();
         })
         .catch(done);
    });
  });

  describe('GET /api/team/all', function() {
    before((done) => {
      Promise.all([
        teamCrud.createTeam({
          name: 'Seattle Sounders',
          city: 'Seattle',
          coach: 'Sigi'
        }),
        teamCrud.createTeam({
          name: 'LA Galaxy',
          city: 'Los Angels',
          coach: 'Arena'
        }),
        teamCrud.createTeam({
          name: 'Portland Timbers',
          city: 'Portland',
          coach: 'Porter'
        }),
        teamCrud.createTeam({
          name: 'New York Cosmos',
          city: 'New York City',
          coach: 'Mr. Nobody'
        }),
        teamCrud.createTeam({
          name: 'Houston Dynamo',
          city: 'Houston',
          coach: 'Who Cares'
        })
      ])
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      Promise.all([
        teamCrud.removeAllTeams()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return an array of six teams', (done) => {
      request.get(`${baseUrl}/api/team/all`)
         .then((res) => {
           expect(res.status).to.equal(200);
           expect(res.body.length).to.equal(5);
           done();
         })
         .catch(done);
    });
  });

});
