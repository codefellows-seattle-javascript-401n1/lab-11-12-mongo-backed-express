'use strict';
// overwrite the process.env.MONGO_URI
process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const noteCrud = require('../lib/note-crud');
const userCrud = require('../lib/user-crud');
request.use(superPromise);

describe('testing module note-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port , () => {
        server.isRunning = true;
        console.log('server up ::', port);
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
        console.log('server down');
        done();
      });
      return;
    }
    done();
  });

  describe('POST /api/note with valid data', function(){
    before((done) => {
      userCrud.createUser({name: 'test name', email: 'test email'})
      .then( user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });

    after((done) => {
      noteCrud.removeAllNotes()
      .then( () => done())
      .catch(done);
    });

    it('should return a note', (done) => {
      request.post(`${baseUrl}/api/note`)
      .send({userId: this.tempUser._id, content: 'test note', name: 'thisNote'})
      .then( res => {
        expect(res.status).to.equal(200);
        expect(res.body.userId).to.equal(`${this.tempUser.id}`);
        done();
      })
      .catch(done);
    });
  });

  describe('POST /api/note with bad data', function(){
    before((done) => {
      userCrud.createUser({name: 'test name', email: 'test email'})
      .then( user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });

    after((done) => {
      noteCrud.removeAllNotes()
      .then( () => done())
      .catch(done);
    });

    it('should return a note', (done) => {
      request.post(`${baseUrl}/api/note`)
      .send({userd: this.tempUser._id, cont: 'test note', nae: 'thisNote'})
      .then((done))
      .catch((err) => {
        try {
          var res = err.response;
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('bad request');
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

});
