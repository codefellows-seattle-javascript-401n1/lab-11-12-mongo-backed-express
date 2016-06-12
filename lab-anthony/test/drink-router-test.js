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
const drinkCrud = require('../lib/drink-crud');

request.use(superPromise);

describe('Testing the drink-router module', function(){
  before((done)=>{
    if (!server.isRunning){
      server.listen(port, ()=>{
        server.isRunning = true;
        console.log('server is running on port:', port);
        done();
      });
      return;
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

  //POST 200
  describe('Testing POST to /api/drinks with valid data', function(){
    before((done)=>{
      cafeCrud.createCafe({cafeName: 'test cafe', cafeAdd:'test address'})
      .then((cafe)=>{
        this.tempCafe = cafe;
        done();
      }).catch(done);
    });

    after((done)=>{
      drinkCrud.removeAllDrinks()
      .then(()=>done()).catch(done);
    });

    after((done)=>{
      cafeCrud.removeAllCafes()
      .then(()=>done()).catch(done);
    });

    it('should return a drink', (done)=>{
      request.post(`${baseUrl}/api/drinks`)
      .send({locId: this.tempCafe._id, drinkName: 'test', drinkDesc: 'test desc'})
      .then((res)=>{
        expect(res.status).to.equal(200);
        expect(res.body.drinkName).to.equal('test');
        expect(res.body.drinkDesc).to.equal('test desc');
        expect(res.body.locId).to.equal(`${this.tempCafe._id}`);
        done();
      }).catch(done);
    });

    it('should return a 400 bad request', function(done){
      request.post(`${baseUrl}/api/drinks`)
      .send({})
      .end((err, res)=>{
        expect(res.status).to.equal(400);
        done();
      });
    });
  });



});
