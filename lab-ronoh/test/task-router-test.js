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
request.use(superPromise);

describe('testing module note-router', function(){
  before((done) =>{
    if(!server.isRunning){
      server.listen(port, () =>{
        server.isRunning = true;
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
  describe('testing POST /api/task with valid data', function(){
    before((done) =>{
      noteCrud.createNote({name:'test note', content: 'test data'})
      .then(note=> {
        this.tempNote = note;
        done();
      })
      .catch(done);
    });
    after((done) => {
      taskCrud.removeAllTasks()
      .then(() => done())
      .catch(done);
    });
    it('should return a task', (done)=> {
      request.post(`${baseUrl}/api/task`)
      .send({noteId: this.tempNote._id, description: 'test task'})
      .then(res=> {
        expect(res.status).to.equal(200);
        expect(res.body.noteId).to.equal(`${this.tempNote._id}`);
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
