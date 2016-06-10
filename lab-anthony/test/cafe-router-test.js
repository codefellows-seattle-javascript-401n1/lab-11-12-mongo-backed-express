'use strict';

//overwrite the mongo uri
process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const cafeCrud = require('../lib/cafe-crud');

request.use(superPromise);

describe('Testing the cafe-router module', function(){
  before((done)=>{
    if (!server.isRunning){
      server.listen(port, ()=>{
        server.isRunning = true;
        console.log('server is running on port:', port);
        done();
      });
    }
    done();
  });

  after((done)=>{
    if(server.isRunning){
      server.close(()=>{
        server.isRunning = false;
        console.log('server has closed');
        done();
      });
      return;
    }
    done();
  });

  //GOOD POST
  describe('Testing POST to /api/cafes with valid data', function(){
    after((done)=>{
      cafeCrud.removeAllCafes()
      .then(()=>done()).catch(done);
    });

    it('should return a cafe', function(done){
      request.post(`${baseUrl}/api/cafes`)
      .send({cafeName: 'test cafe', cafeAdd:'test address'})
      .then((res)=>{
        expect(res.status).to.equal(200);
        expect(res.body.cafeName).to.equal('test cafe');
        expect(res.body.cafeAdd).to.equal('test address');
        done();
      }).catch(done);
    });
  });

  //BAD POST
  describe('Testing POST to /api/cafes with invalid data', function(){
    it('should return 400 bad request', function(done){
      request.post(`${baseUrl}/api/cafes`)
      .send({})
      .end((err, res)=>{
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  //GOOD GET
  describe('Testing GET to /api/cafes/:id with valid data', function(){
    before((done)=>{
      cafeCrud.createCafe({cafeName:'test', cafeAdd:'test address'})
      .then(cafe => {
        this.tempCafe = cafe;
        done();
      }).catch(done);
    });

    after((done)=>{
      cafeCrud.removeAllCafes()
      .then(()=>done()).catch(done);
    });

    it('should return a cafe', (done)=>{
      console.log('THE ID IS', this.tempCafe._id);
      request.get(`${baseUrl}/api/cafes/${this.tempCafe._id}`)
      .then((res)=>{
        expect(res.status).to.equal(200);
        expect(res.body.cafeName).to.equal(this.tempCafe.cafeName);
        done();
      }).catch(done);
    });
  });

  //BAD GET
  describe('Testing GET to /api/cafes/:id with valid data', function(){
    it('should return a 404', (done)=>{
      request.get(`${baseUrl}/api/cafes/123`)
      .end((err, res)=>{
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  //GOOD PUT
  //BAD PUT
  //BAD PUT

  // GOOD DELETE
  describe('Testing DELETE to /api/cafes/:id with valid data', function(){
    before((done)=>{
      cafeCrud.createCafe({cafeName:'test', cafeAdd:'test address'})
      .then(cafe => {
        this.tempCafe = cafe;
        done();
      }).catch(done);
    });

    after((done)=>{
      cafeCrud.removeAllCafes()
      .then(()=>done()).catch(done);
    });

    it('should return a cafe', (done)=>{
      console.log('THE ID IS', this.tempCafe._id);
      request.del(`${baseUrl}/api/cafes/${this.tempCafe._id}`)
      .then((res)=>{
        expect(res.status).to.equal(204);
        done();
      }).catch(done);
    });
  });
  //BAD DELETE
});
