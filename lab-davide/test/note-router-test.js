'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

//npm module//
const debug = require('debug')('note:note-tests');
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');


request.use(superPromise);


//app modules//
const server = require('../server');
const noteCrud = require('../lib/note-crud');

//required modules dependent on global env//
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}/api/note`;


//server is running//
describe('testing module note-router', function() {
  debug('hitting module note router');
  before((done) => {
    if (!server.isRunning) {
      server.listen(port, () => {
        // server.isRunning = true;
        debug('server running on port', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning) {
      debug('server close');
      server.close(() => {
        // server.isRunning = false;
        console.log('server down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing GET /api/note/:id with valid id', function(){
    before((done) => {
      noteCrud.createNote({name: 'test note', content: 'test data'})
      .then(note => {
        debug('Created note for GET tests');
        this.tempNote = note;
        done();
      })
      .catch(() => {
        debug('Failed to create note for GET tests.');
        done();
      });
    });

    after((done) => {
      noteCrud.removeAllNotes()
      .then(() => {
        debug('Deleted notes for GET tests.');
        done();
      })
      .catch(() => {
        debug('Did not delete notes for GET tests.');
        done();
      });
    });

    it('should return a note', (done) => {
      debug('GET note route: '+`${baseUrl}/${this.tempNote._id}`);
      request.get(`${baseUrl}/${this.tempNote._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('test note');
        done();
      })
      .catch(() => {
        expect(true).to.equal(false);
        done();
      });
    });
  });

  describe('testing GET /api/note/:id with bad id', function(){
    it('should return not found', (done) => {
      request.get(`localhost:${port}/ffkijdf`)
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

  describe('testing PUT /api/note/:id with a valid body', function() {
    before((done) => {
      noteCrud.createNote({name: 'test name', content: 'test data' })
        .then(note => {
          debug('Failed to create note for PUT tests.');
          this.tempNote = note;
          done();
        }).catch(done);
    });

    it('should return an updated note', (done) => {
      request.put(`${baseUrl}/${this.tempNote._id}`)
      .send({name: 'updated', content: 'test content'})
        .then((res) => {
          debug('hitting put update');
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('updated');
          done();
        }).catch(done);
    });

    it('should return a bad request', (done) => {
      request.put(`${baseUrl}/2345`)
      .end((err, res) => {
        console.log('error' + err);
        console.log('res' + JSON.stringify(res));
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  describe('POST /api/note with valid data', function (){
    debug('post is working?');
    before((done) =>
      noteCrud.createNote({name: 'test name', content: 'test data' })
      .then(note => {
        debug('created note for POST tests');
        this.tempNote = note;
        done();
      })
      .catch(done)
      );

    it('should return post/api note', (done) => {
      debug('hitting return post/api note');
      request.post(`${baseUrl}`)
      .send({name: 'test name', content: 'test data' })
      .then( res => {
        debug('hitting POST testtttttt');
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('test name');
        expect(res.body.content).to.equal('test content');
        done();
      })
      .catch(done);
    });

    it('should return a bad request', (done) => {
      debug('hitting POST bad request');
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

  describe('testing DELETE /api/note/:id with no body', function (){
    before((done) => {
      debug('hitting delete api/note/:id no body');
      noteCrud.createNote({name: 'test name', content: 'test data' })
      .then(note => {
        debug('Failed to create note for DELETE tests.');
        this.tempNote = note;
        done();
      }).catch(done);
    });

    it('should delete a note', (done) => {
      request.del(`${baseUrl}/${this.tempNote._id}`)
        .then((res) => {
          debug('Hitting delete');
          expect(res.status).to.equal(204);
          done();
        })
      .catch(done);
    });

    it('should return a not found', (done) => {
      request.del(`${baseUrl}/sds${this.tempNote._id}`)
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
