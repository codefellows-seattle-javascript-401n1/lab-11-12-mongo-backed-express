'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

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
const baseUrl = `localhost:${port}`;


//server is running//
describe('testing module note-router', function() {
  before((done) => {
    if (!server.isRunning) {
      server.listen(port, () => {
        console.log('server running on port', port);
        done();
      });
      return;
    }
    done();
  });
});

//server is shutting down//
after((done) => {
  if (server.isRunning) {
    server.close(() => {
      server.isRunning = false;
      console.log('shutting down the server');
      done();
    });
    return;
  }
  done();
});

//GET 200//
describe('testing GET /api/note/:id with valid id', function(){
  before((done) => {
    noteCrud.createNote({name: 'test note', content: 'test data' })
    .then(note => {
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

  it('should return a note', (done) => {
    request.get(`${baseUrl}/${this.tempNote._id}`)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(this.tempNote.name);
      done();
    });
  });


//GET 404//

  it('should return not found', (done) => {
    request.get(`localhost:${port}/api/ffkijdf`)
    .end((res) => {
      expect(res.status).to.equal(404);
      expect(res.response.res.statusMessage).to.equal('not found');
      done();
    });
  });
});

//PUT 200//

describe('testing PUT /api/note with a valid body', function() {
  before((done) => {
    noteCrud.createNote({name: 'test note', content: 'test data' })
    .then(note => {
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

  it('should return an updated note', (done) => {
    request.put(`{$baseUrl}/${this.tempNote.id}`).send({content: 'test update'})
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.content).to.equal('test update');
      done();
    });
  });
});

//DELETE  204 and 404//
describe('testing DELETE /api/note/:id with valid id', function(){
  before((done) => {
    noteCrud.createNote({name: 'test note', content: 'test data' })
    .then(note => {
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

  it('should delete a note', (done) => {
    request.delete(`${baseUrl}/${this.tempNote._id}`)
    .then((res) => {
      expect(res.status).to.equal(204);
      done();
    })
  .catch(done);
  });
});

describe('testing DELETE /api/note/:id with invalid data', function(){
  it('should return not found', (done) => {
    request.get(`localhost:${port}/api/ffkijdf`)
    .end((res) => {
      expect(res.status).to.equal(404);
      expect(res.response.res.statusMessage).to.equal('not found');
      done();
    });
  });
});
