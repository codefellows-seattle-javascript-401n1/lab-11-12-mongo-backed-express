'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const server = require('../server');
const playerCrud = require('../lib/player-crud');
const teamCrud = require('../lib/team-crud');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;

request.use(superPromise);

describe('testing module player-router', function() {
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

  describe('testing POST /api/player', function() {
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
      playerCrud.removeAllPlayers()
      .then(() => done())
      .catch(done);
    });

    it('should return a player with valid data', function(done) {
      request.post(`${baseUrl}/api/player`)
    .send({
      name: 'Taylor Wirtz',
      hometown: 'Seattle',
      position: 'Left Back',
      number: 26,
      teamId: tempTeam._id
    })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal('Taylor Wirtz');
      done();
    })
    .catch(done);
    });

    it('should return a 400 when no body is provided', (done) => {
      request.post(`${baseUrl}/api/player/`)
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        expect(err.response.error.text).to.equal('bad request');
        done();
      });
    });

    it('should return a 400 when invalid body is provided', (done) => {
      request.post(`${baseUrl}/api/player/`)
      .send({
        name: 'taylor'
      })
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        expect(err.response.error.text).to.equal('bad request');
        done();
      });
    });
  });

  describe('testing GET /api/player', function() {
    let tempPlayer = {};
    before((done) => {
      teamCrud.createTeam({
        name: 'Seattle Sounders',
        city: 'Seattle',
        coach: 'Sigi'
      })
      .then((team) => {
        return playerCrud.createPlayer({
          name: 'Taylor Wirtz',
          hometown: 'Seattle',
          position: 'Left Back',
          number: 26,
          teamId: team._id
        });
      })
      .then((player) => {
        tempPlayer = player;
        done();
      })
      .catch(done);
    });

    after((done) => {
      playerCrud.removeAllPlayers()
      .then(() => done())
      .catch(done);
    });

    it('should return a player when a valid id', (done) => {
      request.get(`${baseUrl}/api/player/${tempPlayer._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Taylor Wirtz');
        done();
      })
      .catch(done);
    });

    it('should return an error 404 with invalid id', (done) => {
      request.get(`${baseUrl}/api/player/3923`)
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        expect(err.response.error.text).to.equal('not found');
        done();
      });
    });
  });

  describe('testing PUT /api/player', function() {
    let tempPlayer = {};
    before((done) => {
      teamCrud.createTeam({
        name: 'Seattle Sounders',
        city: 'Seattle',
        coach: 'Sigi'
      })
      .then((team) => {
        return playerCrud.createPlayer({
          name: 'Taylor Wirtz',
          hometown: 'Seattle',
          position: 'Left Back',
          number: 26,
          teamId: team._id
        });
      })
      .then((player) => {
        tempPlayer = player;
        done();
      })
      .catch(done);
    });

    after((done) => {
      playerCrud.removeAllPlayers()
      .then(() => done())
      .catch(done);
    });

    it('should return a player when a valid id', (done) => {
      request.put(`${baseUrl}/api/player/${tempPlayer._id}`)
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
      request.put(`${baseUrl}/api/player/23432`)
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
      request.put(`${baseUrl}/api/player/${tempPlayer._id}`)
      .catch((err) => {
        expect(err.response.error.status).to.equal(400);
        expect(err.response.error.text).to.equal('bad request');
        done();
      });
    });

    it('should return a 400 if invalid body is provided', (done) => {
      request.put(`${baseUrl}/api/player/${tempPlayer._id}`)
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

  describe('testing DELETE /api/player/:id', function() {
    let tempPlayer = {};
    before((done) => {
      teamCrud.createTeam({
        name: 'Seattle Sounders',
        city: 'Seattle',
        coach: 'Sigi'
      })
      .then((team) => {
        return playerCrud.createPlayer({
          name: 'Taylor Wirtz',
          hometown: 'Seattle',
          position: 'Left Back',
          number: 26,
          teamId: team._id
        });
      })
      .then((player) => {
        tempPlayer = player;
        done();
      })
      .catch(done);
    });

    after((done) => {
      playerCrud.removeAllPlayers()
      .then(() => done())
      .catch(done);
    });

    it('should return 204 with a valid id', (done) => {
      request.del(`${baseUrl}/api/player/${tempPlayer._id}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
    });

    it('should return an error 404 with invalid id', (done) => {
      request.del(`${baseUrl}/api/player/3923`)
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        expect(err.response.error.text).to.equal('not found');
        done();
      });
    });
  });

  describe('GET /api/player/all', function() {
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
      request.get(`${baseUrl}/api/player/all`)
         .then((res) => {
           expect(res.status).to.equal(200);
           expect(res.body.length).to.equal(5);
           done();
         })
         .catch(done);
    });
  });

});
