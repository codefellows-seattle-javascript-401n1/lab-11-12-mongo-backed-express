'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const heroCrud = require('../lib/hero-crud');
request.use(superPromise);

describe('testing module hero-router', function(){
  before((done) => {
    if(!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('Server is Up.  Welcome to HQ. Running on ', port);
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
        console.log('server down');
        done();
      });
      return;
    }
    done();
  });
  describe('POST /api/hero/:id with valid and invalid data', function(){
    after((done) => {
      heroCrud.removeAllHeroes()
      .then(() => done())
      .catch(done);
    });
    it('should return a hero', function(done){
      request.post(`${baseUrl}/api/hero`)
      .send({name: 'test hero', content: 'test content'})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('test hero');
        done();
      }).catch(done);
    });
    it('should return 400 for bad request', function(done){
      request.post(`${baseUrl}/api/hero/`).end((err, res) =>{
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('GET /api/hero/:id with valid and invalid id', function(){
    before((done) => {
      heroCrud.createHero({name: 'test hero', content: 'test content'})
      .then(hero => {
        this.tempHero = hero;
        done();
      })
      .catch(done);
    });
    after((done) => {
      heroCrud.removeAllHeroes()
      .then(() => done())
      .catch(done);
    });
    it('should return error 404 for not found', (done) => {
      request.get(`${baseUrl}/api/hero/23092340923409`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('should return a hero', (done) => {
      request.get(`${baseUrl}/api/hero/${this.tempHero._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(this.tempHero.name);
        done();
      })
      .catch(done);
    });
  });
  describe('PUT /api/hero/:id with valid and invalid id', function(){
    before((done) => {
      heroCrud.createHero({name: 'test hero', content: 'test content'})
      .then(hero => {
        this.tempHero = hero;
        done();
      })
      .catch(done);
    });

    after((done) => {
      heroCrud.removeAllHeroes()
      .then(() => done())
      .catch(done);
    });

    it('should return a new name after PUT request is made', (done) => {
      request.put(`${baseUrl}/api/hero/${this.tempHero.id}`).send({name: 'Da Wolf', content: 'test'}).end((req, res) =>{
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Da Wolf');
        done();
      });
    });
    it('should return a 400 code for bad request', (done) => {
      request.put(`${baseUrl}/api/hero/${this.tempHero.id}`).end((req, res) =>{
        expect(res.status).to.equal(400);
        done();
      });
    });
    it('should return a 404 code for not found', (done)=>{
      request.put(`${baseUrl}/api/hero/32423432`).send({name: 'Da Wolf', content: 'test'}).end((req, res)=>{
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  describe('testing DELETE at api/hero/:id', function(){
    before((done) => {
      heroCrud.createHero({name: 'test hero', content: 'test content'})
      .then(hero => {
        this.tempHero = hero;
        done();
      })
      .catch(done);
    });

    after((done) => {
      heroCrud.removeAllHeroes()
      .then(() => done())
      .catch(done);
    });
    it('should return status 404 for not found for not found record', (done)=>{
      request.del(`${baseUrl}/api/hero/34535`)
      .end((req, res)=>{
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('should return status 204 for successful delete', (done) =>{
      request.del(`${baseUrl}/api/hero/${this.tempHero.id}`).end((req, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
  });
});
