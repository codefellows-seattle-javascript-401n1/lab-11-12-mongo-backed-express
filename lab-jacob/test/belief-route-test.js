'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const agentPromise = require('superagent-promise-plugin');

const port = process.env.PORT || 3000;
const homeUrl  = `http://localhost:${port}`;

const beliefCrud = require('../lib/belief-crud');
const deityCrud = require('../lib/deity-crud');
const server = require('../server');
request.use(agentPromise);

describe('testing the belief router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server is up::', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if (server.isRunning){
      server.close(() => {
        server.isRunning = false;
        console.log('server closed');
        done();
      });
      return;
    }
    done();
  });

  describe('testing POST method with valid data', function(){
    before((done) => {
      deityCrud.createDeity({name: 'testiworth', power: 'rather testy'})
      .then( deity => {
        this.tempDeity = deity;
        done();
      })
      .catch(done);
    });

    after((done) => {
      beliefCrud.removeAllBeliefs()
      .then(() => done())
      .catch(done);
    });

    it('should return a belief', (done) => {
      console.log('entering belief test');
      request.post(`${homeUrl}/api/belief`)
      .send({deityId: this.tempDeity._id, name: 'testianity', desc: 'tests are life tests are love'})
      .then((res) => {
        console.log('test then statement');
        expect(res.status).to.equal(200);
        expect(res.body.deityId).to.equal(`${this.tempDeity._id}`);
        done();
      }).catch(done);
    });
  });
});
