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

    describe('testing a bad request for POST', function(){
      it('should return a 400', function(done){
        request.post(`${homeUrl}/api/deity`)
        .send({})
        .then(done)
        .catch( err => {
          const res = err.response;
          expect(res.status).to.equal(400);
          done();
        });
      });
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

    describe('testing not found http error', function() {
      it('should return a 404', function(done) {
        request.get(`${homeUrl}/api/deity/124563324`)
        .then(done)
        .catch( err => {
          const res = err.response;
          expect(res.status).to.equal(404);
          expect(res.body.name).to.equal(undefined);
          done();
        });
      });
    });
  });

  describe('testing PUT method on /api/deity', function(){
    before((done) => {
      deityCrud.createDeity({name: 'Brian', power: 'fuck off Brian'})
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

    it('should return an updated deity', (done) => {
      request.put(`${homeUrl}/api/deity/${this.tempDeity._id}`)
      .send({name: 'MegaBrian'})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('MegaBrian');
        done();
      })
      .catch(done);
    });

    describe('testing a not found PUT request', () => {
      it('should return a 404', (done) => {
        request.put(`${homeUrl}/api/deity/123658176253`)
        .send({name: 'Michael Peterson', power: 'Touchdowns'})
        .then(done)
        .catch((err) =>{
          try {
            const res = err.response;
            expect(res.status).to.equal(404);
            expect(res.text).to.equal('not found');
            done();
          } catch (e) {
            done(e);
          }

        });
      });
    });

    describe('testing a bad PUT request', () =>{
      it('should return a 400 for a bad PUT requeest', (done) => {
        request.put(`${homeUrl}/api/deity/${this.tempDeity._id}`)
        .send({})
        .then(done)
        .catch((err) => {
          try {
            const res = err.response;
            expect(res.status).to.equal(400);
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    });
  });

  describe('testing DELETE method on /api/deity', function(){
    before((done) => {
      deityCrud.createDeity({name: 'dingus', power: 'didgerydoooo'})
      .then(deity => {
        this.tempDeity = deity;
        done();
      })
      .catch(done);
    });

    it('should delete the specified deity', (done) => {
      request.del(`${homeUrl}/api/deity/${this.tempDeity._id}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        expect(res.body.name).to.equal(undefined);
        done();
      })
      .catch(done);
    });

    describe('testing a 404', () => {
      it('should return a 404', (done) => {
        request.del(`${homeUrl}/api/deity/123412341234`)
        .then(done)
        .catch((err) => {
          const res = err.response;
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('not found');
          done();
        });
      });
    });
  });
});
