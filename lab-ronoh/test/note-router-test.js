'use strict';
//overwrite the process.env.MONGO_URI
process.env.MONGO_URI - 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const noteCrud = require('../lib/note-crud');
const taskCrud = require('../lib/task-crud');
// const debug = require('debug');
request.use(superPromise);

describe('testing module note-router', function(){
  before((done) =>{
    if(!server.isRunning){
      server.listen(port, () =>{
        server.isRunning =true;
        console.log('server up on port', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) =>{
    if(server.isRunning){
      server.close(() =>{
        server.isRunning = false;
        console.log('server down');
        done();
      });
      return;
    }
    done();
  });

  describe('POST /api/note with valid data', function(){
    after((done)=>{
      noteCrud.removeAllNotes()
      .then(()=>done())
      .catch(done);
    });

    it('should return a note', function(done){
      request.post(`${baseUrl}/api/note`)
      .send({name: 'test note', content:'test data'})
      .then((res) => {
        // debug('creating note');
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('test note');
        console.log(res.body);
        done();
      }).catch(done);
    });
    describe('POST /api/note no body', function(){
      after((done)=>{
        noteCrud.removeAllNotes()
        .then(()=>done())
        .catch(done);
      });

      it('should return an error', function(done){
        request.post(`${baseUrl}/api/note`)
        .send({})
        .then(() => done())
        .catch(err => {
          console.log('ERROR', err.message);
          expect(err.response.res.statusCode).to.equal(400);
          expect(err.response.res.text).to.equal('bad request');
          done();
        });

      });
    });

    describe('GET /api/note/:id with valid id', function(){
      before((done) => {
        noteCrud.createNote({name: 'booya', content: 'test test 123'})
        .then(note =>{
          this.tempNote = note;
          // console.log(this.tempNote);
          done();
        })
        .catch(done);
      });
      after((done) => {
        noteCrud.removeAllNotes()
        .then(() => done())
        .catch(done);
      });

      it('should return a note', (done) =>{
        request.get(`${baseUrl}/api/note/${this.tempNote._id}`)
        .then((res)=> {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.tempNote.name);
          done();
        })
        .catch(done);
      });
    });
    describe('GET /api/note/:id with NO valid id', function(){
      it('should return an error', (done) =>{
        request.get(`${baseUrl}/api/note/123`)
        .then(() => done())
        .catch(err => {
          expect(err.response.res.statusCode).to.equal(404);
          expect(err.response.res.text).to.equal('not found');
          done();
        })
        .catch(done);
      });
    });
    describe('GET /api/note/:id/tasks with valid id', function(){
      before((done) =>{
        noteCrud.createNote({name: 'booya', content: 'test test 123'})
        .then(note =>{
          this.tempNote = note;
          return Promise.all([
            taskCrud.createTask({noteId: note._id, description: 'test one'}),
            taskCrud.createTask({noteId: note._id, description: 'test two'}),
            taskCrud.createTask({noteId: note._id, description: 'test three'})
          ]);
        })
        .then(tasks => {
          this.tempTask = tasks;
          done();
        })
          .catch(done);
      });

      after((done) => {
        Promise.all([
          noteCrud.removeAllNotes(),
          taskCrud.removeAllTasks()
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return an array of three tasks', (done) => {
        request.get(`${baseUrl}/api/note/${this.tempNote._id}/tasks`)
        .then((res) => {
          console.log('tasks:\n', res.body);
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
          expect(res.body[0].description).to.equal('test one');
          done();
        })
        .catch(done);
      });
    });
  });
  describe('PUT /api/note/:id with valid id', function(){
    before((done) => {
      noteCrud.createNote({name: 'booya', content: 'test test 123'})
      .then(note =>{
        this.tempNote = note;
        done();
      })
      .catch(done);
    });
    after((done) => {
      noteCrud.removeAllNotes()
      .then(() => done())
      .catch(done);
    });

    it('should return a note', (done) =>{
      request.put(`${baseUrl}/api/note/${this.tempNote._id}`)
      .send({content:'retest retest 234'})
      .then((res)=> {
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal('retest retest 234');
        done();
      })
      .catch(done);
    });
  });
  describe('testing DELETE/api/note/:id', function(){
    before((done) => {
      noteCrud.createNote({name: 'booya', content: 'test test 123'})
      .then(note =>{
        this.tempNote = note;
        // console.log(this.tempNote);
        done();
      })
      .catch(done);
    });
    after((done) => {
      noteCrud.removeAllNotes()
      .then(() => done())
      .catch(done);
    });
    it('should delete the note', (done)=>{
      request.del(`${baseUrl}/api/note/${this.tempNote._id}`)
      .then((res) => {
        expect(res.statusCode).to.equal(204);
        expect(res.text).to.equal('');
        done();
      })
      .catch(done);
    });
  });
  describe('testing DELETE/api/note/:id task with an invalid id', function(){
    it('should error', (done)=>{
      request.del(`${baseUrl}/api/note/123`)
      .then(() => done())
      .catch(err => {
        expect(err.response.res.statusCode).to.equal(404);
        expect(err.response.res.text).to.equal('not found');
        done();
      });
    });
  });
  describe('testing PUT with no valid Id', function(){
    it('should return an error', (done)=> {
      request.put(`${baseUrl}/api/note/123`)
      .send({content:'ABANDON ALL HOPE!'})
      .then(done)
      .catch(err => {
        try {
          // expect(err.response.res.statusCode).to.equal(404);
          // expect(err.response.res.text).to.equal('not found');
          const res = err.response;
          expect(res.statusCode).to.equal(404);
          expect(res.text).to.equal('not found');
          done();
        } catch(err){
          done(err);
        }
      });
    });
  });
  describe('testing PUT bad input', function(){
    before((done) => {
      noteCrud.createNote({name: 'booya', content: 'test test 123'})
      .then(note =>{
        this.tempNote = note;
        done();
      })
      .catch(done);
    });
    after((done) => {
      noteCrud.removeAllNotes()
      .then(() => done())
      .catch(done);
    });
    it('should return an error', (done)=> {
      request.put(`${baseUrl}/api/note/${this.tempNote._id}`)
      .send({})
      .then(done)
      .catch(err => {
        try {
          // expect(err.response.res.statusCode).to.equal(404);
          // expect(err.response.res.text).to.equal('not found');
          const res = err.response;
          expect(res.statusCode).to.equal(400);
          expect(res.text).to.equal('bad request');
          done();
        } catch(err){
          done(err);
        }
      });
    });
  });
});
