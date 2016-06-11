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

describe('testing the NPC-route', function(){
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
  describe('testing the npc/ POST route with valid data', function(){
    before((done) => {
      encounterCrud.createEncounter({
        name: 'Tes NPC holder',
        description: 'a Giant test holding a croud of testers on it\'s deck',
        cr: 12
      }).then(encounter => {
        this.tempEncounter = encounter;
        done();
      })
      .catch(done);
      console.log('Before NPC post hit');
    });
    after((done) => {
      encounterCrud.removeAllEncounters()
      .then(npcCrud.removeAllNPCs())
      .then(() => done()).catch(done);
    });
    it ('should return an NPC', (done) => {
      request.post(`${baseUrl}/api/npc`)
      .send({encounterId: `${this.tempEncounter._id}`, name: 'Tester Test', classes: 'tester', race: 'test'})
      .then((res) => {
        console.log('POST valid res.body.name', res.body.name);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Tester Test');
        expect(res.body.classes).to.equal('tester');
        done();
      }).catch(done);
    });
  describe('testing the npc/ POST route with valid data', function(){
      before((done) => {
        encounterCrud.createEncounter({
          name: 'Tes NPC holder',
          description: 'a Giant test holding a croud of testers on it\'s deck',
          cr: 12
        }).then(encounter => {
          this.tempEncounter = encounter;
          done();
        })
        .catch(done);
        console.log('Before NPC post hit');
      });
      after((done) => {
        encounterCrud.removeAllEncounters()
        .then(npcCrud.removeAllNPCs())
        .then(() => done()).catch(done);
      });
      it ('Sent with invalid data should return a 400', (done) => {
        request.post(`${baseUrl}/api/npc`)
        .send({name: 'Tester Test', classes: 'tester', race: 'test'})
        .end((err, res) => {
        console.log('POST with invalid linked', res.body.name);
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('Error: Bad Request');
        done();
        }).catch(done);
      });
    });
  });
});
