'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise= require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const brewerCrud = require('../lib/brewer-crud');
const brewCrud = require('../lib/brew-crud');
request.use(superPromise);

describe('Testing module brew-route', function() {
  before((done) => {
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        console.log(('Server is running on PORT: ', port));
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
        console.log('server is down');
        done();
      });
      return;
    }
    done();
  });
  describe('POST /api/brewer with data', function() {
    before((done) => {
      brewerCrud.createBrewer({name: '!arms', content: 'it in the sleeves'})
      .then(brewer => {
        this.tempBrewer = brewer;
        done();
      })
      .catch(done);
    });
    after((done) => {
      brewerCrud.removeAllBrewers()
      .then(brewCrud.removeAllBrews())
      .then(() => done())
      .catch(done);
    });
    it('Should return a new brew', (done) => {
      request.post(`${baseUrl}/api/brewer`)
      .send({desc:'day1', brewerId:this.tempBrewer.id})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.desc).to.equal('day1');
        done();
      }).catch(done);
    });
    it('should return 400, bad request', function(done) {
      request.post(`${baseUrl}/api/brewer`).end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });


  describe('GET /api/brew/:id with valid data', function() {
    before((done) => {
      brewerCrud.createBrewer({name: '!arms', content: 'troll fodder'})
      .then(brewer => {
        this.tempBrewer = brewer;
        return brewCrud.createBrew({desc: 'day2', brewerId: this.tempBrewer.id});
      }).then(brew => {
        this.tempBrew = brew;
        done();
      })
      .catch(done);
    });
    after((done) => {
      brewerCrud.removeAllBrewers()
      .then(brewCrud.removeAllBrews())
      .then(() => done())
      .catch(done);
    });
    it('Should return 404, not found', (done) => {
      request.get(`${baseUrl}/api/brew/1234567`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('Should return a brew', (done) => {
      request.get(`${baseUrl}/api/brewer/${this.tempBrew._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.brew).to.equal(this.tempBrew.brew);
        done();
      });
    });
  });



  describe('PUT /api/brewer/:id with valid ID', function() {
    before((done) => {
      brewerCrud.createBrewer({name: '!arms', content: 'troll talk'})
      .then(brewer => {
        this.tempBrewer = brewer;
        return brewCrud.createBrew({dec: 'day3'});
      }).then(brew => {
        this.tempBrew = brew;
        done();
      })
      .catch(done);
    });
    after((done) => {
      brewerCrud.removeAllBrewers()
      .then(brewCrud.removeAllBrews())
      .then(() => done())
      .catch(done);
    });
    it('Should return a 400 bad request', (done) => {
      request.put(`${baseUrl}/api/brewer/${this.tempBrew._id}`)
      .send({desc: 'day4', brewerId: this.tempBrew.id})
      .end((req, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
    it('Shsould return a 404 not found', (done) => {
      request.put(`${baseUrl}/api/brew/1234455`).send({desc: 'day5', brewId: this.tempBrewer.id}).end((req, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('Should return 200 for not date provided', (done) => {
      request.put(`${baseUrl}/api/brew/${this.tempBrew._id}`).send({desc: 'day5',  brewerId:this.tempBrewer.id}).end((req, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('Testing DELETE ar api/brewer/:id', function() {
    before((done) => {
      brewerCrud.createBrewer({name: '!arms', content:'troll make coffee'})
      .then(brewer => {
        this.tempBrewer = brewer;
        return brewCrud.createBrew({desc: 'day7', brewId: this.tempBrewer.id});
      }).then(brew => {
        this.tempBrew = brew;
        done();
      })
      .catch(done);
    });
    after((done) => {
      brewerCrud.removeAllBrewers()
      .then(brewCrud.removeAllBrews())
      .then(() => done())
      .catch(done);
    });
    it('Should return a status 404 not found', (done) => {
      request.del(`${baseUrl}/api/brew/1231234`)
      .end((req, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('Should return a 204 for completed delete', (done) => {
      request.del(`${baseUrl}/api/brew/${this.tempBrewer.id}`).end((req, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
  });
});
