'use strict';
//use test db for this module.  Make sure this line is before loading of server and the 'port' const
process.env.MONGO_URI = 'mongodb://localhost/test';
const expect = require('chai').expect;
const request = require('superagent-use');
const supPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const repairCrud = require('../lib/repair-crud');
const receiptCrud = require('../lib/receipt-crud');


request.use(supPromise);

describe('Testing REPAIR router', function(){
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
      repairCrud.removeAllRepairs()
      .then(() => done())
      .catch(done);
    });
    before((done) => {
      receiptCrud.createReceipt({customerLastName: 'Wilson', autoMake: 'VW', autoYear: 2015 })
      .then(receipt => {
        this.tempReceipt = receipt;
        done();
      }).catch(done);
    });

    it('should return a Repair', (done) => {
      request.post(`${baseUrl}/api/repair`)
      .send({mechanicLastName: 'Remmy', repairName: 'strut replacement', laborCost: 75.00, partsCost: 375.00, receiptId: this.tempReceipt._id})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.partsCost).to.equal(375.00);
        expect(res.body.receiptId).to.equal(`${this.tempReceipt._id}`);
        done();
      }).catch(done);
      /*in mocha, if you pass 'done' in catch, it logs the error and ends the test.*/
    });
  });

  describe('Testing GET with valid request and id', function(){
    before((done) => {
      receiptCrud.createReceipt({customerLastName: 'Wilson', autoMake: 'VW', autoYear: 2015 })
      .then(receipt => {
        this.tempReceipt = receipt;
      })
      .then(() => {
        repairCrud.createRepair({mechanicLastName: 'Remmy', repairName: 'strut replacement', laborCost: 75.00, partsCost: 375.00, receiptId: this.tempReceipt._id})
        .then(repair => {
          this.tempRepair = repair;
          done();
        });
      }).catch(done);
    });



    it('should return a Repair', (done) => {
      request.get(`${baseUrl}/api/repair/${this.tempRepair._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.partsCost).to.equal(375.00);
        expect(res.body.repairName).to.equal('strut replacement');
        done();
      }).catch(done);
    });
  });
  describe('Testing GET with INVALID request id', function(){
    before((done) => {
      receiptCrud.createReceipt({customerLastName: 'Wilson', autoMake: 'VW', autoYear: 2015 })
      .then(receipt => {
        this.tempReceipt = receipt;
      })
      .then(() => {
        repairCrud.createRepair({mechanicLastName: 'Remmy', repairName: 'strut replacement', laborCost: 75.00, partsCost: 375.00, receiptId: this.tempReceipt._id})
        .then(repair => {
          this.tempRepair = repair;
          done();
        });
      }).catch(done);
    });

    after((done) => {
      repairCrud.removeAllRepairs()
      .then(() => done()).catch(done);
    });

    it('should return a 404 not found', (done) => {
      request.get(`${baseUrl}/api/repair/123s456`)
      .then(done)
      .catch(err => {
        const res = err.response;
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('not found');
        done();
      });
    });
  });
  describe('Testing PUT with valid id', function(){
    before((done) => {
      receiptCrud.createReceipt({customerLastName: 'Wilson', autoMake: 'VW', autoYear: 2015 })
      .then(receipt => {
        this.tempReceipt = receipt;
      })
      .then(() => {
        repairCrud.createRepair({mechanicLastName: 'Remmy', repairName: 'strut replacement', laborCost: 75.00, partsCost: 375.00, receiptId: this.tempReceipt._id})
        .then(repair => {
          this.tempRepair = repair;
          done();
        });
      }).catch(done);
    });

    it('should return a modified Repair object', (done) => {
      request.put(`${baseUrl}/api/repair/${this.tempRepair._id}`)
      .send ({mechanicLastName: 'TestName', repairName: 'test put repair', laborCost: 100.00, partsCost: 200.00, receiptId: `${this.tempReceipt._id}`})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.repairName).to.equal('test put repair');
        expect(res.body.laborCost).to.equal(100.00);
        expect(res.body.partsCost).to.equal(200.00);
        expect(res.body.receiptId).to.equal(`${this.tempReceipt._id}`);
        done();
      })
      .catch(done);
    });
  });

  describe('Testing DELETE with a valid id', function(req, res){
    before((done) => {
      receiptCrud.createReceipt({customerLastName: 'Wilson', autoMake: 'VW', autoYear: 2015 })
      .then(receipt => {
        this.tempReceipt = receipt;
      })
      .then(() => {
        repairCrud.createRepair({mechanicLastName: 'Remmy', repairName: 'testing delete repair', laborCost: 75.25, partsCost: 375.25, receiptId: `${this.tempReceipt._id}`})
        .then(repair => {
          this.tempRepair = repair;
          done();
        });
      }).catch(done);
    });
    it('should remove the document from the collection', (done) => {
      request.del(`${baseUrl}/api/repair/${this.tempRepair._id}`)
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      }).catch(err => console.log('err: ', err));
       //    .catch(err => res.sendError(err));
      done();
    });
  });
});
