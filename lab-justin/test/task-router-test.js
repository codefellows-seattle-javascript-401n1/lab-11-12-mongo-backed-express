'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test-task';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const taskCrud = require('../lib/task-crud');
const noteCrud = require('../lib/note-crud');

request.use(superPromise);

describe('testing module task-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port , () => {
        server.isRunning = true;
        console.log('server up and running', port);
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
        console.log('Good bye');
        done();
      });
      return;
    }
    done();
  });
//POST
  describe('POST /task with valid data', function(){
    after((done) => {
      taskCrud
      .removeAllTasks()
      .then( () => done())
      .catch(done);
    });

    before((done) => {
      //noteCrud on lecture note
      noteCrud.createNote({name: 'test note', content: 'test data'})
      .then( note => {
        this.tempNote = note;
        done();
      })
      .catch(done);
    });
//POST 200
    it('should return a task', (done) => {
      request
      .post(`${baseUrl}/api/note/${this.tempNote._id}/task`)
      .send({noteId: this.tempNote._id, desc: 'test task'})
      .then( (res) => {
        expect(res.status).to.equal(200);
        expect(res.body.noteId).to.equal(`${this.tempNote._id}`);
        done();
      })
      .catch(done);
    });
//POST 400
    it('should return "bad request"', (done) => {
      request
      .post(`${baseUrl}/api/note/${this.tempNote._id}/task`)
      .then(done)
      .catch( err => {
        let res = err.response;
        expect(res.status).to.eql(400);
        expect(res.text).to.eql('bad request');
        done();
      });
    });
  });
//GET
  describe('GET /task with valid id', function(){
    after((done) => {
      taskCrud
      .removeAllTasks()
      .then(() => done())
      .catch(done);
    });

    before((done) => {
      console.log('HIT IT', this.tempNote._id);
      taskCrud
      .createNote({noteId: this.tempNote._id, desc:'Cheese Cake'})
      .then(note => {
        this.tempNote = note;
        done();
      })
      .catch(done);
    });

// //GET 200
    it('should return a note', (done) => {
      request
      .get(`${baseUrl}/api/note/${this.tempNote._id}/task/${this.tempNote._id}`)
      .then((res) => {
        expect(res.status).to.eql(200);
        expect(res.body.name).to.eql(this.tempNote.name);
        done();
      })
      .catch(done);
    });

    // it('should return "not found"', (done) => {
    //   request
    //   .get(baseUrl)
    //   .then(done)
    //   .catch( err => {
    //     let res = err.message;
    //     expect(res.status).to.eql(404);
    //     expect(res.text).to.eql('not found');
    //     done();
    //   });
    // });


  });


});
