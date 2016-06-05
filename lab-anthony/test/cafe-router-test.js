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
});
