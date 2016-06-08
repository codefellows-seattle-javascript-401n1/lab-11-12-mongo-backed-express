use strict';
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
