'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');

const server = require('../server');
const storeCrud = require('../lib/store-crud');

const port = process.env.PORT || 3000;
const baseURL = `http://localhost:${port}`;

request.use(superPromise);

describe('testing store module', function(){

  // start 'er up for testing
  before((done) => {
    if (!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server running on port:', port);
        done();
      });
      return;
    }
    done();
  });

// then shut 'er down after testing
  after((done) => {
    if (server.isRunning){
      server.close(() => {
        console.log('server is shut down');
        done();
      });
      return;
    }
    done();
  });

// NOW let's start testing the routes.
  describe('POST /api with valid data', function(){
    // remove test data upon POST test completion
    after((done) => {
      storeCrud.removeAllStores()
      .then( () => done()).catch(done);
    });

    it('should return status 200 and a store', function(done) {
      request.post(`${baseURL}/api/store`)
        .send({name: 'test name', store: 'test store'})
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.store).to.equal('test store');
          done();
        })
      .catch(done);
    });

    it('should return status 400 for invalid body', (done) => {
      request.post(`${baseURL}/api/store`)
      .send({thisProperty: 'doesNotExist'})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

    it('should return status 400 for no body', (done) => {
      request.post(`${baseURL}/api/store`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

  }); // end of POST block

  describe('GET /api/store/:id with valid id', function(){
    // gotta post a store to GET a store first....
    before((done) => {
      storeCrud.createStore({name: 'test name', store: 'test store' })
      .then( store => {
        this.tempStore = store;
        done();
      });
    });
    // ...then delete that test store
    after((done) => {
      storeCrud.removeAllStores()
      .then( () => done()).catch(done);
    });

    it('should return status 200 and a store', (done) => {
      request.get(`${baseURL}/api/store/${this.tempStore._id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.store).to.equal('test store');
        done();
      });
    });

    it('should return status 404 for nonexistent id', (done) => {
      request.get(`${baseURL}/api/store/1234`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  }); // end of GET block

  describe('PUT /api/store/:id with valid id and data', function(){
    before((done) => {
      storeCrud.createStore({name: 'test name', store: 'test store' })
      .then( store => {
        this.tempStore = store;
        done();
      });
    });
    after((done) => {
      storeCrud.removeAllStores()
      .then( () => done()).catch(done);
    });

    it('should return status 200 and a store', (done) => {
      request.put(`${baseURL}/api/store/${this.tempStore._id}`)
      .send({ store: 'test store is changed'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.store).to.equal('test store is changed');
        done();
      });
    });

    it('should return status 400 for no body', (done) => {
      request.put(`${baseURL}/api/store/${this.tempStore._id}`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

    it('should return status 400 for invalid body', (done) => {
      request.put(`${baseURL}/api/store/${this.tempStore._id}`)
      .send({ hello: 'i love you'})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

    it('should return status 404 for nonexistent id', (done) => {
      request.put(`${baseURL}/api/store/1234`)
      .send({ store: 'test store isn\'t actually changed'})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  }); // end of PUT block

  describe('DELETE /api/store/:id', function(){
    before((done) => {
      storeCrud.createStore({name: 'test name', store: 'test store' })
      .then( store => {
        this.tempStore = store;
        done();
      });
    });

    it('should return status 204 for OK request with no body', (done) => {
      request.del(`${baseURL}/api/store/${this.tempStore._id}`)
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });

    it('should return status 404 for valid id entered but not found', (done) => {
      request.del(`${baseURL}/api/store/1234`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  }); // end of DELETE block

}); // end of test store module
