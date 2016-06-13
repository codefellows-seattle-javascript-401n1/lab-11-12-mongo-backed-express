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
  describe('POST task/:id/task with valid data', function(){
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
        expect(res.status).to.eql(200);
        expect(res.body.noteId).to.eql(`${this.tempNote._id}`);
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
  describe('GET /api/note/:id/tasks with valid id', () => {
    before((done) => {
      noteCrud.createNote({name: 'booya', content: 'test test 123'})
      .then(note => {
        this.tempNote = note;
        return Promise.all([
          taskCrud.createTask({noteId: note._id, desc: 'test one'}),
          taskCrud.createTask({noteId: note._id, desc: 'test two'}),
          taskCrud.createTask({noteId: note._id, desc: 'test three'})
        ]);
      })
      .then( tasks => {
        this.tempTasks = tasks;
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
//GET 200
    it('should return an array of three tasks', (done) => {
      request
      .get(`${baseUrl}/api/note/${this.tempNote._id}/tasks`)
      .then((res) => {
        console.log('tasks:\n', res.body);
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        expect(res.body[0].desc).to.equal('test one');
        done();
      })
      .catch(done);
    });

//GET 404
    it('should return "not found"', (done) => {
      request
      .get(baseUrl)
      .then(done)
      .catch( err => {
        try{
          let res = err.response;
          expect(res.status).to.equal(404);
          expect(res.text).to.eql('not found');
          done();
        } catch(err) {
          done(err);
        }
      });
    });
  });

//DELETE
  describe('DELETE /note/:id/tasks with valid id', function(){
    after((done) => {
      Promise.all([
        noteCrud.removeAllNotes(),
        taskCrud.removeAllTasks()
      ])
      .then(() => done())
      .catch(done);
    });

    before((done) => {
      noteCrud.createNote({name:'cats', content:'meow 123'})
        .then(note => {
          this.tempNote = note;
          taskCrud.createTask({noteId: note._id, desc: '123'})
            .then(done())
            .catch(done);
        }).catch(done);
    });

  //DELETE 204
    it('should return "no content"', (done) => {
      request
      .del(`${baseUrl}/api/note/${this.tempNote._id}/task`)
      .then((res) => {
        expect(res.status).to.eql(204);
        expect(res.text).to.eql('');
        done();
      })
      .catch(done);
    });

  //DELETE 404
    it('should return "not found"', (done) => {
      request
      .del(baseUrl)
      .then(done)
      .catch( err => {
        let res = err.response;
        expect(res.status).to.eql(404);
        expect(res.text).to.eql('not found');
        done();
      });
    });
  });

});
