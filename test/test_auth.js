const assert = require("assert");
const request = require("supertest");
const app = require('../app');

const Users = require('../models/users')
const Snippet = require('../models/snippet')

describe('POST /api/signup - add a user to the database', function() {
  before('reset the test database', function(done) {
    Users.remove({}).then(function() {});
    Snippet.remove({}).then(function() {});

    setTimeout(function() {
      return done();
    }, 1000);
  })

  it('Should add user "Reynard" to the user collection', function(done) {
    request(app).post('/api/signup')
      .send({
        "username": "Reynard",
        "password": "reyRey"
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect({
        "success": true,
        "newUsername": "Reynard"
      })
      .end(done)
  });
  it('Should add user "Seymour" to the user collection', function(done) {
    request(app).post('/api/signup')
      .send({
        "username": "Seymour",
        "password": "smellMoo"
      })
      .expect(200)
      .expect({
        "success": true,
        "newUsername": "Seymour"
      })
      .end(done)
  });
  it('Should verify there are 2 users in the DB', function (done) {
    Users.count({}).then(function(num) {
      assert.equal(num, 2);
      done();
    })
  })
  it('Should return that brad:test is an invalid user:pass', function(done) {
    request(app).get('/api/check')
    .auth("brad", "test")
    .expect(401)
    .end(done)
  })
  it('Should return that Reynard:reyRey is a valid user:pass', function(done) {
    request(app).get('/api/check')
      .auth("Reynard", "reyRey")
      .expect(200)
      .expect({
        "success": true,
        "username": "Reynard"
      })
      .end(done)
  })
})
