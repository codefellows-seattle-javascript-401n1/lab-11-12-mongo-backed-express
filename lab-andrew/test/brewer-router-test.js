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

    it('should return a brewer', (done) => {
      request.get(`${baseUrl}/api/brewer/${this.tempBrewer._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(this.tempBrewer.name);
        done();
      })
      .catch(done);
    });
  });


  describe('Testing GET /api/brewer/:id/brew with valid id', function() {
    before((done) => {
      brewerCrud.createBrewer({name: 'trolls', content: 'bridge'})
      .then((brewer) => {
        this.tempBrewer = brewer;
        return Promise.all([
          brewCrud.createBrew({brewerId: brewer._id, desc: 'test one'}),
          brewCrud.createBrew({brewerId: brewer._id, desc: 'test two'}),
          brewCrud.createBrew({brewerId:        brewer._id, desc: 'test three'})
        ]);
      })
      .then(brew => {
        this.tempBrewer = brew;
        done();
      })
      .catch(done);
    });

    after((done) => {
      Promise.all([
        brewerCrud.removeAllBrewers(),
        brewCrud.removeAllBrews()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return an array of three brews', (done) => {
      request.get(`${baseUrl}/api/brewer/${this.tempBrewer._id}/brew`)
      .then((res) => {
        console.log(('brew: ', res.body));
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        expect(res.body[0].troll).to.equal('hello');
        done();
      })
      .catch(done);
    });
  });
});
