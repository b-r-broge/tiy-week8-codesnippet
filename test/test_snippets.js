const assert = require("assert");
const request = require("supertest");
const app = require('../app');

const Users = require('../models/users')
const Snippet = require('../models/snippet')

const userData = require('./assets/usersdb')

var reyId, seyId

describe('POST /api/snippet/ - add a snippet to the database', function() {
  before('reset the test users collection', function(done) {
    Users.remove({}).then(function() {done()})
  });
  before('reset the test snippets collection', function(done) {
    Snippet.remove({}).then(function() {done()})
  });
  before('Add default users to users collection', function (done) {
    Users.bulkWrite(
      userData.users.map((x) => {
        return {
          insertOne: {
            document: {
              "username": x.username,
              "password": x.password
            }
          }
        }
      })
    ).then(function(resp) {
      reyId = String(resp.insertedIds['1'])
      seyId = String(resp.insertedIds['2'])
      done()
    })
  });
  // Add tests here
  it('Should give an authorization error', function (done) {
    request(app).post('/api/snippet/create')
    .auth("brad", "brad")
    .send({
      "title": "test",
      "snippet": "test test",
      "notes": "",
      "language": "english",
      "tags": ["test"]
    })
    .set('Accept', 'application/json')
    .expect(401)
    .end(done)
  })
  it('Should add a new code snippet for Reynard to the database', function (done) {
    request(app).post('/api/snippet/create')
    .auth("Reynard", "reyRey")
    .send({
      "title": "sample snippet",
      "snippet": "This is a sample snippet for the use of the purpose",
      "notes": "",
      "language": "english",
      "tags": ["sample", "test", "simple"]
    })
    .set('Accept', 'application/json')
    .expect(200)
    .expect(function (res) {
      assert.equal(res.body.success, true);
      assert.equal(res.body.title, 'sample snippet');
      reyId = res.body.id
    })
    .end(done)
  })
  it('Should add a new code snippet for Seymour to the database', function (done) {
    request(app).post('/api/snippet/create')
    .auth("Seymour", "smellMoo")
    .send({
      "title": "Seymour's snippet",
      "snippet": "Seymours snippet is the best snippet.\n It should be considered above all others",
      "notes": "very Seymour",
      "language": "puppy",
      "tags": ["test", "seymour"]
    })
    .set('Accept', 'application/json')
    .expect(200)
    .expect(function (res) {
      assert.equal(res.body.success, true);
      assert.equal(res.body.title, 'Seymour\'s snippet');
      seyId = res.body.id
    })
    .end(done)
  })
  // verify both items are in the database
  it('Should verify there are 2 users in the DB', function (done) {
    Snippet.count({}).then(function(num) {
      assert.equal(num, 2);
      done();
    })
  })
  // Request all snippets that have been added
  it('Should respond with all of the snippets', function (done) {
    request(app).get('/api/homepage')
    .auth("Reynard", "reyRey")
    .expect(200)
    .expect({
      "success": true,
      "snippets": [
        {
          "title": "sample snippet",
          "author": "Reynard",
          "id": reyId,
          "snippet": "This is a sample snippet for the use of the purpose",
          "notes": "",
          "language": "english",
          "tags": ["sample", "test", "simple"]
        },
        {
          "title": "Seymour's snippet",
          "author": "Seymour",
          "id": seyId,
          "snippet": "Seymours snippet is the best snippet.\n It should be considered above all others",
          "notes": "very Seymour",
          "language": "puppy",
          "tags": ["test", "seymour"]
        }
      ]
    })
    .end(done)
  })
  it('Should respond with a specific snippet', function (done) {
    request(app).get('/api/snippet/'+reyId)
    .auth("Reynard", "reyRey")
    .expect(200)
    .expect({
      "success": true,
      "snippet":  {
        "title": "sample snippet",
        "author": "Reynard",
        "id": reyId,
        "snippet": "This is a sample snippet for the use of the purpose",
        "notes": "",
        "language": "english",
        "tags": ["sample", "test", "simple"]
      }})
    .end(done)
  })
})
