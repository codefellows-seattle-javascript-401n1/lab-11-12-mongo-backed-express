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
  describe('Testing POST to /api/drinks with valid and invalid data', function(){
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

    //POST 404
    it('should return a 400 bad request', function(done){
      request.post(`${baseUrl}/api/drinks`)
      .send({})
      .end((err, res)=>{
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  //GET 200/404
  describe('Testing GET to /api/drinks/:id with valid and invalid data', function(){
    before((done)=>{
      cafeCrud.createCafe({cafeName: 'test cafe', cafeAdd:'test address'})
      .then((cafe)=>{
        this.tempCafe = cafe;
        done();
      }).catch(done);
    });

    before((done)=>{
      drinkCrud.createDrink({drinkName: 'test', drinkDesc:'test desc', locId: this.tempCafe._id})
      .then((drink)=>{
        this.tempDrink = drink;
        done();
      }).catch(done);
    });

    before((done)=>{
      drinkCrud.createDrink({drinkName: 'test2', drinkDesc:'test2 desc', locId: this.tempCafe._id})
      .then((drink)=>{
        this.tempDrink2 = drink;
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

    it('should return a drink by id', (done)=>{
      request.get(`${baseUrl}/api/drinks/${this.tempDrink._id}`)
      .then((res)=>{
        expect(res.status).to.equal(200);
        expect(res.body.drinkName).to.equal('test');
        done();
      }).catch(done);
    });

    it('should return drinks by cafe id', (done)=>{
      request.get(`${baseUrl}/api/cafes/${this.tempCafe._id}/drinks`)
      .then((res)=>{
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
        expect(res.body[0].drinkName).to.equal('test');
        expect(res.body[1].drinkName).to.equal('test2');
        done();
      }).catch(done);
    });

    it('should return a 404 not found', function(done){
      request.get(`${baseUrl}/api/drinks/123`)
      .then(done)
      .catch((err)=>{
        expect(err.response.error.status).to.equal(404);
        done();
      });
    });
  });

  //PUT 200/404/400
  describe('Testing PUT to /api/drinks/:id with valid and invalid data', function(){
    before((done)=>{
      cafeCrud.createCafe({cafeName: 'test cafe', cafeAdd:'test address'})
      .then((cafe)=>{
        this.tempCafe = cafe;
        done();
      }).catch(done);
    });

    before((done)=>{
      drinkCrud.createDrink({drinkName: 'test', drinkDesc:'test desc', locId: this.tempCafe._id})
      .then((drink)=>{
        this.tempDrink = drink;
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
      request.put(`${baseUrl}/api/drinks/${this.tempDrink._id}`)
      .send({drinkName: 'edited'})
      .then((res)=>{
        expect(res.status).to.equal(200);
        expect(res.body.drinkName).to.equal('edited');
        done();
      }).catch(done);
    });

    it('should return a 400 bad request', (done)=>{
      request.put(`${baseUrl}/api/drinks/${this.tempDrink._id}`)
      .send({})
      .then(()=>done())
      .catch((err)=> {
        expect(err.response.error.status).to.equal(400);
        done();
      });
    });

    it('should return a 404 not found', (done)=>{
      request.put(`${baseUrl}/api/drinks/123`)
      .send({drinkName:'edited'})
      .then(()=>done())
      .catch((err)=> {
        expect(err.response.error.status).to.equal(404);
        done();
      });
    });
  });

  //DEL 204/404
  describe('Testing DELETE to /api/drinks/:id with valid and invalid data', function(){
    before((done)=>{
      cafeCrud.createCafe({cafeName: 'test cafe', cafeAdd:'test address'})
      .then((cafe)=>{
        this.tempCafe = cafe;
        done();
      }).catch(done);
    });

    before((done)=>{
      drinkCrud.createDrink({drinkName: 'test', drinkDesc:'test desc', locId: this.tempCafe._id})
      .then((drink)=>{
        this.tempDrink = drink;
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
      request.del(`${baseUrl}/api/drinks/${this.tempDrink._id}`)
      .then((res)=>{
        expect(res.status).to.equal(204);
        done();
      }).catch(done);
    });

    it('should return a 404 not found', function(done){
      request.del(`${baseUrl}/api/drinks/123`)
      .then(done)
      .catch((err)=>{
        expect(err.response.error.status).to.equal(404);
        done();
      });
    });
  });
});
