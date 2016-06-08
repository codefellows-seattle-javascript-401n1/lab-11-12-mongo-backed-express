'use strict';
//use test db for this module.  Make sure this line is before loading of server and the 'port' const
process.env.MONGO_URI = 'mongodb://localhost/test';
const expect = require('chai').expect;
const request = require('superagent-use');
const supPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
// const baseUrl = `localhost:${port}`;
const server = require('../server');
const receiptOps = require('../lib/receipt-ops');
request.use(supPromise);

describe('Testing receipt router', function(){
  before((done) => {
    if(!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server is running on port: ', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning){
      server.close(() => {
        console.log('server has been shutdown');
        done();
      });
      return;
    }
    done();
  });
  describe('Testing POST with valid request', function(){
    after((done) => {
      receiptOps.removeReceiptDocuments()
      .then(() => done()).catch(done);
    });

    it('should return a receipt', function(done){
      request.post(`${baseUrl}/api/receipt`)
      .send({customerLastName: 'Smith', autoMake: 'Audi', autoYear: 2010, repairName: 'water pump replacement', repairCost: 356.78 })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.autoMake).to.equal('Audi');
        done();
      }).catch(done);
    });
  });
});
