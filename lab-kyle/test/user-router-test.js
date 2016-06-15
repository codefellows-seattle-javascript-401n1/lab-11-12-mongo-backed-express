'use strict';
// overwrite the process.env.MONGO_URI
process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const userCrud = require('../lib/user-crud');
const noteCrud = require('../lib/note-crud');
request.use(superPromise);

describe('testing module user-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port , () => {
        server.isRunning = true;
        console.log('server up :', port);
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
//Testing POST routes 200
  describe('POST /api/user with valid data', function(){
    after((done) => {
      userCrud.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a user', function(done){
      request.post(`${baseUrl}/api/user`)
      .send({name: 'kyle', email: 'kyle@codefellows.com'})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('kyle');
        done();
      }).catch(done);
    });
  });
//Testing POST route 400
  describe('POST /api/user with invalid data', function(){
    after((done) => {
      userCrud.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a 400 bad request', function(done){
      request.post(`${baseUrl}/api/user`)
      .send({na: 'kyle', ema: 'kyle@codefellows.com'})
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
//Testing GET routes 200
  describe('GET /api/user/:id with valid id', function(){
    before((done) => {
      userCrud.createUser({name: 'kyle', email: 'kyle@codefellows.com'})
      .then(user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });

    after((done) => {
      userCrud.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a user', (done) => {
      request.get(`${baseUrl}/api/user/${this.tempUser._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(this.tempUser.name);
        done();
      })
      .catch(done);
    });
  });
//Testing GET route 404
  describe('GET /api/user/:id with bad id', function(){
    before((done) => {
      userCrud.createUser({name: 'kyle', email: 'kyle@codefellows.com'})
      .then(user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });

    after((done) => {
      userCrud.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a 404 not found', (done) => {
      request.get(`${baseUrl}/api/user/7896857465`)
      .then(done)
      .catch((err) => {
        try {
          var res = err.response;
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('not found');
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
//Extra credit GET route
  describe('GET /api/user/:id/notes with valid id', function(){
    before((done) => {
      userCrud.createUser({name: 'Lyle', email: 'lyle@codefellows.com'})
      .then(user => {
        this.tempUser = user;
        return Promise.all([
          noteCrud.createNote({userId: user._id, name: 'test one', content: 'one'}),
          noteCrud.createNote({userId: user._id, name: 'test two', content: 'two'}),
          noteCrud.createNote({userId: user._id, name: 'test three', content: 'three'})
        ]);
      })
      .then( notes => {
        this.tempNotes = notes;
        done();
      })
      .catch(done);
    });

    after((done) => {
      Promise.all([
        userCrud.removeAllUsers(),
        noteCrud.removeAllNotes()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return an array of three notes', (done) => {
      request.get(`${baseUrl}/api/user/${this.tempUser._id}/note`)
      .then((res) => {
        console.log('notes:\n', res.body);
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        expect(res.body[0].name).to.equal('test one');
        done();
      })
      .catch(done);
    });
  });

  //Testing PUT routes 200
  describe('PUT /api/user/id with valid id', function(){
    before((done) => {
      userCrud.createUser({name: 'kyle', email: 'kyle@codefellows.com'})
      .then(user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });

    after((done) => {
      userCrud.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a user', (done) => {
      request.put(`${baseUrl}/api/user/${this.tempUser.id}`)
      .send({email:'kyle@gmail.com'})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.email).to.equal('kyle@gmail.com');
        done();
      }).catch(done);
    });
  });
//Testing PUT route 400
  describe('PUT /api/user/id with bad id', function(){
    before((done) => {
      userCrud.createUser({name: 'kyle', email: 'kyle@codefellows.com'})
      .then(user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });

    after((done) => {
      userCrud.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a 400 bad request', (done) => {
      request.put(`${baseUrl}/api/user/${this.tempUser.id}`)
      .send({emil: '9087'})
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

//Testing DELETE routes 404
  describe('DELETE /api/user/:id with bad id', function(){
    before((done) => {
      userCrud.createUser({name: 'kyle', email: 'kyle@codefellows.com'})
      .then(user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });

    after((done) => {
      userCrud.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return 404 not found', (done) => {
      request.del(`${baseUrl}/api/user/78654`)
      .then(done)
      .catch((err) => {
        try {
          var res = err.response;
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('not found');
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('DELETE /api/user/:id with no content', function(){
    before((done) => {
      userCrud.createUser({name: 'kyle', email: 'kyle@codefellows.com'})
      .then(user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });

    after((done) => {
      userCrud.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return a user', (done) => {
      request.del(`${baseUrl}/api/user/${this.tempUser._id}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        expect(res.text).to.equal('');
        done();
      })
      .catch(done);
    });
  });

});
