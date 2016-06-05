'use strict';
//overwrite the process.env.MONGO_URI so our test objects don't go in the app database
process.env.MONGO_URI = 'mongodb://localhost/test-db';
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const server = require('../server');
const encounterCrud = require('../lib/encounter-crud');
const npcCrud = require('../lib/npc-crud');
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}`;
request.use(superPromise);

describe('testing the encounter-route', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port , () => {
        server.isRunning = true;
        console.log('server is up and running on', port);
        done();
      });
      return;
    }
    done()
  });
  after((done) => {
    if (server.isRunning){
      server.close(() =>{
        server.isRunning = false;
        console.log('server is down');
        done();
      });
      return
    }
    done()
  });

  describe('POST /api/encounter with valid Data', function(){
    after((done) => {
      encounterCrud.removeAllEncounters()
      .then(() => done()).catch(done);
    });
    it ('should return an encounter', function(done){
      request.post(`${baseUrl}/api/encounter`)
      .send({name: 'test encounter', description: 'you turn a corner and come face to face with a wild test', cr: 22})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('test encounter');
        expect(res.body.cr).to.equal(22);
        done();
      }).catch(done);
    });
  });

  describe('POST /api/encounter with invalid Data', function(){
    var response;
    before((done) => {
      request.post(`${baseUrl}/api/encounter`)
      .send('22')
      .then((res) => {
        console.log('then block hit');
        var response = res;
        done();
      }).catch(done);
    })
    after((done) => {
      encounterCrud.removeAllEncounters()
      .then(() => done()).catch(done);
    });
    it ('should return an 400 error', function(done){
      console.log('response', response);
      expect(response.status).to.equal(400);
      expect(response.text).to.equal('Error: Bad Request');
      done();
    })
  });
});
