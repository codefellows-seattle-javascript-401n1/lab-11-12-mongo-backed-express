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

  describe('POST /api/user with valid data', function(){
    after((done) => {
      userCrud.removeAllNotes()
      .then(() => done())
      .catch(done);
    });

    it('should return a user', function(done){
      request.post(`${baseUrl}/api/note`)
      .send({name: 'kyle', email: 'kyle@codefellows.com'})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('new user');
        done();
      }).catch(done);
    });
  });

  describe('GET /api/user/:id with valid id', function(){
    before((done) => {
      userCrud.createUser({name: 'kyle', content: 'kyle@codefellows.com'})
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

  describe('GET /api/user/:id/notes with valid id', function(){
    before((done) => {
      userCrud.createUser({name: 'kyle', email: 'kyle@codefellows.com'})
      .then(user => {
        this.tempUser = user;
        return Promise.all([
          noteCrud.createNote({noteId: this.note._id, desc: 'test one'}),
          noteCrud.createNote({noteId: this.note._id, desc: 'test two'}),
          noteCrud.createNote({noteId: this.note._id, desc: 'test three'})
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
      request.get(`${baseUrl}/api/note/${this.tempUser._id}/notes`)
      .then((res) => {
        console.log('tasks:\n', res.body);
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        expect(res.body[0].slug).to.equal('hello');

        done();
      })
      .catch(done);
    });
  });
});
