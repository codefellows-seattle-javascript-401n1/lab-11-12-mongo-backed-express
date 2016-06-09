'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const brewerCrud = require('../lib/brewer-crud');
const brewCrud = require('../lib/brew-crud');
request.use(superPromise);

describe('testing module brewer-route', function() {
  before((done) => {
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        console.log(`server running on PORT:${port}`);
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
        console.log('sever is down');
        done();
      });
      return;
    }
    done();
  });
  describe('Testing POST /api/brewer with valid data', function() {
    after((done) => {
      brewerCrud.removeAllBrewers()
      .then(() => done())
      .catch(done);
    });

    it('should return a brewer', function(done) {
      request.post(`${baseUrl}/api/brewer`)
      .send({name: 'test name', content: 'test content'})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('test name');
        done();
      }).catch(done);
    });
    it('should return a 400, bad request', function(done) {
      request.post(`${baseUrl}/api/brewer/`).end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });


  describe('testing GET /api/brewer/:id with valid id', function() {
    before((done) => {
      brewerCrud.createBrewer({name:'!arms', content: 'troll talk'})
      .then(brewer => {
        this.tempBrewer = brewer;
        done();
      })
      .catch(done);
    });

    after((done) => {
      brewerCrud.removeAllBrewers()
      .then(() => done())
      .catch(done);
    });

    it('should return a an error 404, not found', (done) => {
      request.get(`${baseUrl}/api/brewer/123456`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('should return a brewer', (done) => {
      request.get(`${baseUrl}/api/brewer/${this.tempBrewer._id }`)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(this.tempBrewer.name);
      done();
    })
    .catch(done);
    });
  });


  describe('Testing PUT /api/brewer/:id with valid ID', function() {
    before((done) => {
      brewerCrud.createBrewer({name: 'trolls', content: 'bridge'})
      .then((brewer => {
        this.tempBrewer = brewer;
        done();
      })
      .catch(done);
    });

    after((done) => {
      brewerCrud.removeAllBrewers()
        .then(() => done())
        .catch(done);
    });

    it('should return a new name from PUT request', (done) => {
      request.put(`${baseUrl}/api/brewer/${this.tempBrewer._id}/brew`)
      .send({name: 'top troll', content: 'better bridge'})
      .end((req, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('top troll');
        done();
      });
    });
    it('should return a 400 bad request', (done) => {
      request.put(`${baseUrl}/api/brewer/${this.tempBrewer.id}`)
      .end((req, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
    it('should return a status 404 not found', (done) => {
      request.put(`${baseUrl}/api/brewer/123456`)
      .send({name: 'try troll', content: 'try bridge'})
      .end((req, res) => {
        expect(this.status).to.equal(404);
        done();
      });
    });
  });

  describe('testing Delete at /api/brewer/:id', function() {
    before((done) => {
      brewerCrud.createBrewer({name: 'top brew', content: 'this brew'})
      .then(brewer => {
        this.tempBrewer = brewer;
        done();
      })
      .catch(done);
    });

    after((done) => {
      brewerCrud.removeAllBrewers()
      .then(() => done())
      .catch(done);
    });
    it('should return a status 404 not found', (done) => {
      request.del(`${baseUrl}/api/brewer/12345`)
      .end((req, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('should return a status 204 deleted', (done) => {
      request.del(`${baseUrl}/api/brewer/${this.tempBrewer.id}`)
      .end((req, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
  });
});
