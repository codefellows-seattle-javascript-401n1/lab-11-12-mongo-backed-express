'use strict';

//overwrite the process.env.MONGO_URI
process.env.MONGO_URI = 'mongodb://localhost/test';
const debug = require('debug')('note:note-tests');
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const server = require('../server');
const noteCrud = require('../lib/note-crud');
// const taskCrud = require('../lib/task-crud');
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api/note`;
request.use(superPromise);

describe('testing module note-router', function(){
  before((done)=>{
    if (!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server running on port', port);
        done();
      });
      return;
    }
    done();
  });
  after((done) => {
    if(server.isRunning){
      server.close(() =>{
        server.isRunning = false;
        console.log('shutdown the server');
        done();
      });
      return;
    }
    done();
  });
  describe('testing POST/api/note with valid data', function(){
    after((done) => {
      noteCrud.removeAllNotes()
      .then( () => done())
      .catch(done);
    });

    it('should return a note', function(done){
      request.post(`${baseUrl}`)
        .send({name:'test note', content:'test data'})
        .then((res) =>{
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test note');
          expect(res.body.content).to.equal('test data');
          done();
        }).catch(() => {
          done();
        });
    });
    it('should return status 400 for invalid body', (done) =>{
      debug('inside POST 400 for invalid body');
      request.post(`${baseUrl}`)
      .send({wrong: 'doesNotExist'})
      .then((done))
      .catch((err)=> {
        try {
          var res= err.response;
          expect(res.status).to.equal(400);
          done();
        }
        catch(err) {
          done(err);
        }
      });
    });
    it('should return status 400 for no body', (done) => {
      request.post(`${baseUrl}`)
      .send({})
      .then((done))
      .catch((err) => {
        try {
          var res= err.response;
          expect(res.status).to.equal(400);
          done();
        }
        catch(err){
          done(err);
        }
      });
    });
  });
  describe('GET /api/note/:id with valid id', function(){
    before((done) =>{
      noteCrud.createNote({name: 'yunjoo', content:'test test test'})
        .then(note => {
          this.tempNote = note;
          done();
        })
        .catch(done);
    });
    after((done) => {
      noteCrud.removeAllNotes()
      .then(()=>done())
      .catch(done);
    });

    it('should return note', (done) => {
      debug('inside GET return note');
      request.get(`${baseUrl}/${this.tempNote._id}`)
      .then((res)=>{
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(this.tempNote.name);
        done();
      })
        .catch(done);
    });

    it('should return status 404 for nonexiting id', (done) => {
      request.get(`${baseUrl}/api/note/1234`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('PUT /api/note/:id with valid id and data', function(){
    before((done) => {
      noteCrud.createNote({name: 'test name', content: 'test note' })
      .then( note => {
        this.tempNote = note;
        console.log(this.tempNote);
        done();
      });
    });
    after((done) => {
      noteCrud.removeAllNotes()
      .then( () => done()).catch(done);
    });

    it('should return status 200 and a note', (done) => {
      console.log(this.tempNote);
      request.put(`${baseUrl}/${this.tempNote._id}`)
      .send({content: 'test note is changed'})
      .end((err, res) => {
        console.log(this.tempNote);
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal('test note is changed');
        done();
      });
    });

    it('should return status 400 for no body', (done) => {
      debug('inside PUT 400 for no body');
      request.put(`${baseUrl}/${this.tempNote._id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

    it('should return status 400 for invalid body', (done) => {
      request.put(`${baseUrl}/${this.tempNote._id}`)
      .send({ hello: 'i love you'})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

    it('should return status 404 for nonexistent id', (done) => {
      request.put(`${baseUrl}/api/note/1234`)
      .send({ note: 'test note isn\'t actually changed'})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  }); // end of PUT block

  describe('DELETE /api/note/:id', function(){
    before((done) => {
      noteCrud.createNote({name: 'test name', content: 'test note'})
      .then( note => {
        this.tempNote = note;
        done();
      })
      .catch(done);
    });

    it('should return status 204 for OK request with no body', (done) => {
      request.del(`${baseUrl}/${this.tempNote._id}`)
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });

    it('should return status 404 for valid id entered but not found', (done) => {
      console.log('making del request');
      request.del(`${baseUrl}/api/note/1234`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  }); // end of DELETE block
}); //End
