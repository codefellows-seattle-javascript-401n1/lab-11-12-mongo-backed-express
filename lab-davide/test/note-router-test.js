'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const debug = require('debug')('note:note-tests');
const expect = require('chai').expect;
//add superagent-use plug in//
const superPromise = require('superagent-promise-plugin');
const request = require('superagent-use');

request.use(superPromise);


//require app modules//
const server = require('../server');
const noteCrud = require('../lib/note-crud');

//required modules dependent on global env//
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}/api/note`;


//server is running//
describe('testing module note-router', function() {
  before((done) => {
    if (!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        debug('server running on port', port);
        done();
      });
    }
  });
  describe('testing GET /api/note/:id with valid id', function(){
    before((done) => {
      noteCrud.createNote({name: 'test note', content: 'test data'})
      .then(note => {
        debug('Created note for GET tests.');
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
});

//GET 404//
describe('testing GET /api/note/:id with bad id', function(){
  it('should return not found', (done) => {
    request.get(`localhost:${port}/api/ffkijdf`)
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


//PUT 200//
describe('testing PUT /api/note/:id with a valid body', function() {
  before((done) => {
    noteCrud.createNote({name: 'test name', content: 'test content' })
      .then(note => {
        debug('Failed to create note for PUT tests.');
        this.tempNote = note;
        done();
      }).catch(done);
  });

  after((done) => {
    noteCrud.removeAllNotes()
    .then(() =>  done())
    .catch(done);
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

  after((done) => {
    noteCrud.removeAllNotes()
    .then(() =>  done())
    .catch(done);
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

//DELETE  204 and 404//
describe('testing DELETE /api/note/:id with no body', function (){
  before((done) => {
    debug('hitting delete');
    noteCrud.createNote({name: 'test name', content: 'test content' })
    .then(note => {
      debug('Failed to create note for DELETE tests.');
      this.tempNote = note;
      done();
    }).catch(done);
  });

  after((done) => {
    noteCrud.removeAllNotes()
    .then(() => done())
    .catch(done);
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
});
