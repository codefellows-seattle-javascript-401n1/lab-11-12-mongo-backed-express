
'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const debug = require('debug')('task:task-router-test');
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');

request.use(superPromise);

//app modules/
const server = require('../server');
const taskCrud = require('../lib/task-crud');

//required modules dependent on global env//
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}/api/task`;



describe('testing module task-router', function() {
  debug('hitting module task router');
  before((done) => {
    if (!server.isRunning) {
      server.listen(port, () => {
        debug('server running on port', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning) {
      debug('server is close');
      server.close(() => {
        done();
      });
      return;
    }
    done();
  });

  describe('testing GET /api/task/:id with a valid id', function() {
    before((done) => {
      taskCrud.createTask({content: 'test task', desc: 'test data', dueDate: '2016-06-21'})
      .then(task => {
        debug('created task for GET tests!!!');
        this.tempTask = task;
        console.log('task task', this.tempTask);
        done();
      })
      .catch(() => {
        debug('Failed to create task for GET tests');
        done();
      });
    });

    it('should return a task', (done) => {
      debug('GET task route: '+`${baseUrl}/${this.tempTask._id}`);
      request.get(`${baseUrl}/${this.tempTask._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.desc).to.equal('test data');
        done();
      })
      .catch(() => {
        expect(true).to.equal(false);
        done();
      });
    });

    it('should return not found', (done) => {
      debug('GET task route not found: '+`${baseUrl}/${this.tempTask._id}`);
      request.get(`${baseUrl}/123${this.tempTask._id}`)
      .then(done)
      .catch((err) => {
        try {
          var res = err.response;
          expect(res.status).to.equal(404);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('POST /api/task with valid data', function (){
    debug('post api/task is working?');
    before((done) =>
      taskCrud.createTask({content: 'test task', desc: 'test data', dueDate: '2016-06-21'})
      .then(task => {
        debug('created task for POST tests');
        this.tempTask = task;
        done();
      })
      .catch(done)
      );

    it('should return a task', (done) => {
      debug('hitting return a task');
      request.post(`${baseUrl}`)
      .send({content: 'test task', desc: 'test data', dueDate: '2016-06-21'})
      .then( res => {
        debug('hitting post/api/task 200 testtt');
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal('test task');
        expect(res.body.desc).to.equal('test data');
        done();
      })
      .catch(done);
    });

    it('should return a bad request', (done) => {
      debug('hitting post/api/task 400 bad request');
      request.post(`${baseUrl}`)
      .then(done)
      .catch((err) => {
        try {
          var res = err.response;
          expect(res.status).to.equal(400);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('DELETE /api/task/:id with no body', function (){
    before((done) => {
      debug('hitting DELETE no body');
      taskCrud.createTask({content: 'test task', desc: 'test data', dueDate: '2016-06-21'})
      .then(note => {
        debug('Failed to create note for DELETE tests.');
        this.tempTask = note;
        done();
      }).catch(done);
    });
    after((done) => {
      taskCrud.removeAllTask()
      .then(() => done())
      .catch(done);
    });

    it('should delete a task', (done) => {
      request.del(`${baseUrl}/${this.tempTask._id}`)
        .then((res) => {
          debug('Hitting delete api/task 204');
          expect(res.status).to.equal(204);
          done();
        })
      .catch(done);
    });

    it('should return a not found', (done) => {
      request.del(`${baseUrl}/sds${this.tempTask._id}`)
      .then(done)
      .catch((err) => {
        debug('delete not founddd!!');
        var res = err.response;
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
});
