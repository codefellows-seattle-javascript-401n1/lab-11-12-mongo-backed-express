'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const agentPromise = require('superagent-promise-plugin');

const port = process.env.PORT || 3000;
const homeUrl = `http://localhost:${port}`;

const deityCrud = require('../lib/deity-crud');
const server = require('../server');
request.use(agentPromise);

describe('testing the deity router', function(){
  before((done) => {
    if(!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server up:', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning){
      server.close(() => {
        server.isRunning = false;
        console.log('server closed');
        done();
      });
      return;
    }
    done();
  });

  describe('testing POST method on /api/deity', function(){
    after((done) => {
      deityCrud.removeAllDeities()
      .then(() => done())
      .catch(done);
    });

    it('should return a deity', function(done){
      request.post(`${homeUrl}/api/deity`)
      .send({name: 'tester', power: 'testing'})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('tester');
        done();
      }).catch(done);
    });
  });

  describe('testing GET method on /api/deity', function(){
    before((done) => {
      deityCrud.createDeity({name: 'thadeus', power: 'gift of gab'})
      .then(deity => {
        this.tempDeity = deity;
        done();
      })
      .catch(done);
    });

    after((done) => {
      deityCrud.removeAllDeities()
      .then(() => done())
      .catch(done);
    });

    it('should fetch a deity', (done) => {
      request.get(`${homeUrl}/api/deity/${this.tempDeity._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(this.tempDeity.name);
        done();
      })
      .catch(done);
    });
  });
});
