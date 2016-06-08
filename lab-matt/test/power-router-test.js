'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const heroCrud = require('../lib/hero-crud');
const powerCrud = require('../lib/power-crud');
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
  describe('POST /api/power with valid and invalid data', function(){
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
      .then(powerCrud.removeAllPowers())
      .then(() => done())
      .catch(done);
    });
    it('should return a new power', (done)=>{
      request.post(`${baseUrl}/api/power`)
      .send({power: 'test power', heroId: this.tempHero.id})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.power).to.equal('test power');
        done();
      }).catch(done);
    });
    it('should return 400 for bad request', function(done){
      request.post(`${baseUrl}/api/power`).end((err, res) =>{
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('GET /api/power/:id with valid and invalid id', function(){
    before((done) => {
      heroCrud.createHero({name: 'test hero', content: 'test content'})
      .then(hero => {
        this.tempHero = hero;
        return powerCrud.createPower({power: 'test power', weakness: 'test weakness', heroId:this.tempHero.id});
      }).then(power =>{
        this.tempPower = power;
        done();
      })
      .catch(done);
    });
    after((done) => {
      heroCrud.removeAllHeroes()
      .then(powerCrud.removeAllPowers())
      .then(() => done())
      .catch(done);
    });
    it('should return error 404 for not found', (done) => {
      request.get(`${baseUrl}/api/power/23092340923409`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('should return a power', (done) => {
      request.get(`${baseUrl}/api/power/${this.tempPower._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.power).to.equal(this.tempPower.power);
        done();
      });
    });
  });
  describe('PUT /api/power/:id with valid and invalid id', function(){
    before((done) => {
      heroCrud.createHero({name: 'test hero', content: 'test content'})
      .then(hero => {
        this.tempHero = hero;
        return powerCrud.createPower({power: 'test power', weakness: 'test weakness', heroId: this.tempHero.id});
      }).then(power =>{
        this.tempPower = power;
        done();
      })
      .catch(done);
    });
    after((done) => {
      heroCrud.removeAllHeroes()
      .then(powerCrud.removeAllPowers())
      .then(() => done())
      .catch(done);
    });
    it('should return 400 for bad request with PUT', (done)=>{
      request.put(`${baseUrl}/api/power/${this.tempPower._id}`).send({name:'new power', weakness:'new weakness', heroId:this.tempHero._id}).end((req, res) =>{
        expect(res.status).to.equal(400);
        done();
      });
    });
    it('should return 404 for not found with PUT', (done)=>{
      request.put(`${baseUrl}/api/power/12093921090`).send({power:'new power', weakness:'new weakness', heroId:123098213}).end((req, res) =>{
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('should return 200 for updated power with PUT', (done)=>{
      request.put(`${baseUrl}/api/power/${this.tempPower._id}`).send({power:'new power', weakness:'new weakness', heroId:this.tempHero._id}).end((req, res) =>{
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('testing DELETE at api/hero/:id', function(){
    before((done) => {
      heroCrud.createHero({name: 'test hero', content: 'test content'})
      .then(hero => {
        this.tempHero = hero;
        return powerCrud.createPower({power: 'test power', weakness: 'test weakness', heroId: this.tempHero.id});
      }).then(power =>{
        this.tempPower = power;
        done();
      })
      .catch(done);
    });
    after((done) => {
      heroCrud.removeAllHeroes()
      .then(powerCrud.removeAllPowers())
      .then(() => done())
      .catch(done);
    });
    it('should return status 404 for not found for not found record', (done)=>{
      request.del(`${baseUrl}/api/power/34535`)
      .end((req, res)=>{
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('should return status 204 for successful delete', (done) =>{
      request.del(`${baseUrl}/api/power/${this.tempPower.id}`).end((req, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
  });
});
