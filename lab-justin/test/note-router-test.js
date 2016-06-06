'use strict';
// overwrite the process.env.MONGO_URI
process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const server = require('../server');
const noteCrud = require('../lib/note-crud');
// const taskCrud = require('../lib/task-crud');
request.use(superPromise);

describe('testing module note-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port , () => {
        server.isRunning = true;
        console.log('server up ::', port);
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

//POST 200
  describe('POST /api/note with valid data', function(){
    after((done) => {
      noteCrud.removeAllNotes()
      .then(() => done())
      .catch(done);
    });

    it('should return a note', (done) => {
      request
      .post(`${baseUrl}/api/note`)
      .send({name: 'test note', content: 'test data'})
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('test note');
        done();
      })
        .catch(done);
    });
//POST 400
    it('should return "bad request"', function(done){
      request
      .post(`${baseUrl}/api/note`)
      .send({})
      .then(done)
      // .then((res) =>{
      //   expect(res.status).to.eql(400);
      //   // console.log('HIT IT', res.text);
      //   expect(res.text).to.eql('bad request');
      //   done();
      // })
     .catch( err => {
       let res = err.response;
       expect(res.status).to.eql(400);
       expect(res.text).to.eql('bad request');
       done();
     });
    });
//HW
  });
//GET 200
  describe('GET /api/note/:id with valid id', function(){
    before((done) => {//mocking the data here now
      noteCrud.createNote({name:'booya', content:'test test 123'})
      .then(note => {
        this.tempNote = note;
        done();
      })
      .catch(done);
    });

    after((done) => {
      noteCrud.removeAllNotes()
      .then(() => done())
      .catch(done);
    });
//
    it('should return a note', (done) => {
      request
      .get(`${baseUrl}/api/note/${this.tempNote._id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(this.tempNote.name);
        // expect(res.body.name).to.eql('booya');
        done();
      })
        .catch(done);
    });
//GET 404????
    // it('should return "not found"', (done) => {
    //   request
    //   .get(`${baseUrl}/note/${this.tempNote._id}`)
    //   .then((res) => {
    //     expect(res.status).to.eql(404);
    //     expect(res.text).to.eql('not found');
    //     done();
    //   })
    //  .catch(done);
    // });
  });

//TASK???
  // describe('GET /api/note/:id/tasks with valid id', () => {
  //   before((done) => {
  //     noteCrud.createNote({name: 'booya', content: 'test test 123'})
  //     .then(note => {
  //       this.tempNote = note;
  //       return Promise.all([
  //         taskCrud.createTask({noteId: note._id, desc: 'test one'}),
  //         taskCrud.createTask({noteId: note._id, desc: 'test two'}),
  //         taskCrud.createTask({noteId: note._id, desc: 'test three'})
  //       ]);
  //     })
  //     .then( tasks => {
  //       this.tempTasks = tasks;
  //       done();
  //     })
  //     .catch(done);
  //   });
  //
  //   after((done) => {
  //     Promise.all([
  //       noteCrud.removeAllNotes(),
  //       taskCrud.removeAllTasks()
  //     ])
  //     .then(() => done())
  //     .catch(done);
  //   });
  //
  //   it('should return an array of three tasks', (done) => {
  //     request.get(`${baseUrl}/api/note/${this.tempNote._id}/tasks`)
  //     .then((res) => {
  //       console.log('tasks:\n', res.body);
  //       expect(res.status).to.equal(200);
  //       expect(res.body.length).to.equal(3);
  //       expect(res.body[0].slug).to.equal('hello');
  //
  //       done();
  //     })
  //     .catch(done);
  //   });
  // });
//DELETE
  describe('DELETE /api/note/:id/tasks with valid id', function(){
    after((done) => {
      noteCrud.removeAllNotes()
      .then(() => done())
      .catch(done);
    });
    before((done) => {
      noteCrud.createNote({name:'cats', content:'meow 123'})
      .then(note => {
        this.tempNote = note;
        done();
      })
      .catch(done);
    });

    it('should return "no content"', (done) => {
      request
      .del(`${baseUrl}/api/note/${this.tempNote._id}`)
      .then((res) => {
        expect(res.status).to.eql(200);
        // expect(res.text).to.eql('ok');
        done();
      })
      .catch(done);
    });
//DELETE 404???
    // it('should return "not found"', (done) => {
    //   request
    //   .del(baseUrl)
    //   .then((res) => {
    //     expect(res.status).to.eql(404);
    //     expect(res.text).to.eql('not found');
    //     done();
    //   })
    //   .catch(done);
    // });
  });
//PUT
  describe('PUT /api/note', function(){
    after((done) => {
      noteCrud.removeAllNotes()
      .then(() => done())
      .catch(done);
    });
    before((done) => {
      noteCrud.createNote({name:'James Bond', content:'007'})
      .then(note => {
        this.tempNote = note;
        done();
      })
      .catch(done);
    });

    it('should update', (done) => {
      request
      .put(`${baseUrl}/api/note/${this.tempNote._id}`)
      .send({name:'justin', content:'meow'})
      .then((res) => {
        expect(res.statis).to.eql(200);
        expect(res.body.content).to.eql('meow');
        done();
      })
      .catch(done);
    });

//to be completed later



  });
});
