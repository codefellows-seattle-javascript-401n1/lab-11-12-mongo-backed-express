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
    done();
  });
  after((done) => {
    if (server.isRunning){
      server.close(() =>{
        server.isRunning = false;
        console.log('server is down');
        done();
      });
      return;
    }
    done();
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
        console.log('POST valid res.body.name', res.body.name);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('test encounter');
        expect(res.body.cr).to.equal(22);
        done();
      }).catch(done);
    });
  });

  describe('POST /api/encounter with invalid Data', function(){
    it('should return a 400 error', function(done){
      request.post(`${baseUrl}/api/encounter`)
      .end((err, res) => {
        console.log('POST error res.body.name', res.body.name);
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('bad request');
        done();
      });
    });
  });

  describe('GET api/encounter route with valid data', function(){
    before((done) => {
      encounterCrud.createEncounter({
        name: 'Test Get',
        description: 'You pull the Glowing encounter from the stone database',
        cr: 12,
        extra: 'what?'
      }).then(encounter => {
        this.tempEncounter = encounter;
        done();
      })
      .catch(done);
      console.log('GET Before hit');
    });
    after((done) => {
      encounterCrud.removeAllEncounters()
      .then(() => done()).catch(done);
    });
    it('should return Test Get', (done) => {
      request.get(`${baseUrl}/api/encounter/${this.tempEncounter._id}`)
      .end((err, res) => {
        console.log('GET Valid res.body.name', res.body.name);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Test Get');
        expect(res.body.cr).to.equal(12);
        done();
      });
    });
  });
  describe('GET api/encounter route with invalid data', function(){
    it('should return 404', (done) => {
      request.get(`${baseUrl}/api/encounter/00000000000000`)
      .end((err, res) => {
        console.log('GET invalid res.body.name', res.body.name);
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('not found');
        done();
      });
    });
    it('should return 404', (done) => {
      request.get(`${baseUrl}/api/encounter`)
      .end((err, res) => {
        console.log('GET res.body.name', res.body.name);
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('not found');
        done();
      });
    });
  });
});
