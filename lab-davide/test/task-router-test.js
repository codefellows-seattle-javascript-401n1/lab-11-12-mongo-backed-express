'use strict';


const expect = require('chai').expect;
const request = require('superagent');
const taskCrud = require('../lib/task-crud');
const noteCrud = require('../lib/note-crud');



const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}`;
const server = require('../server');
// request.use(superPromise);


describe('testing module task-router', function() {
  before((done) => {
    if (!server.isRunning) {
      server.listen(port, () => {
        console.log('server up ::', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        console.log('server down');
        done();
      });
      return;
    }
    done();
  });

  describe('POST /api/task with valid data', function(){
    before((done) =>
  noteCrud.createNote({name: 'test note', content: 'test data'})
  .then(note => {
    this.tempNote = note;
    done();
  })
  .catch(done)
);

    after((done) => {
      taskCrud.removeAllTasks()
    .then( () => done())
    .catch(done);
    });
    it('should return a task', (done) => {
      request.post(`${baseUrl}/api/task`)
      .send({noteId: this.tempNote._id, desc: 'test task'})
      .then( res => {
        expect(res.stats).to.equal(200);
        expect(res.body.noteId).to.equal(this.tempNote._id);
      })
      .catch(done);
    });
  });
});
