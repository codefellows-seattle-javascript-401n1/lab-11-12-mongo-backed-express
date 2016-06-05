'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const server = require('../server');
const playerCrud = require('../lib/player-crud');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;

request.use(superPromise);

describe('testing module player-router', function() {
  before((done) => {
    if (!server.isRunning) {
      server.listen(port, () => {
        server.isRunnign = true;
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

  describe('testing POST /api/player with valid data', function() {
    after((done) => {
      playerCrud.removeAllPlayers()
      .then(() => done())
      .catch(done);
    });
  });

  it('should return a player', function(done) {
    request.post(`${baseUrl}/api/player`)
    .send({
      name: 'Taylor Wirtz',
      hometown: 'Seattle',
      position: 'Left Back',
      number: 26
    })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal('Taylor Wirtz');
      done();
    })
    .catch(done);
  });

  describe('GET /api/player with valid id', function() {
    let tempPlayer = {};
    before((done) => {
      playerCrud.createPlayer({
        name: 'Taylor Wirtz',
        hometown: 'Seattle',
        position: 'Left Back',
        number: 26
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

    it('shoudl return a player', (done) => {
      request.get(`${baseUrl}/api/player/${tempPlayer._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Taylor Wirtz');
        done();
      })
      .catch(done);
    });
  });
});
