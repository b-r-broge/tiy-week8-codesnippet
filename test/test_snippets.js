const assert = require("assert");
const request = require("supertest");
const app = require('../app');

const Users = require('../models/users')
const Snippet = require('../models/snippet')

var reyId, seyId, reySnipId, seySnipId

describe('POST /api/snippet/ - add a snippet to the database', function() {
  before('reset the test users collection', function(done) {
    Users.remove({}).then(function() {done()})
  });
  before('reset the test snippets collection', function(done) {
    Snippet.remove({}).then(function() {done()})
  });
  before('Add default users to users collection', function (done) {
    Users.bulkWrite([
      {
        insertOne: {
          document: {
            "username": "Reynard",
            "password": "$2a$08$tTpz/NtZnZkgIePuy.l84eoONPtdqcJ3CE1sNzF71LG/pS0D3QSDu"
          }
        }
      },
      {
        insertOne: {
          document: {
            "username": "Seymour",
            "password": "$2a$08$vy5U6HWoSEoaFysTWC4Gy.gHENQhHnPfZ7Mtgi61.0NPxEpeWxzni"
          }
        }
      }
    ]).then(function(resp) {
      reyId = String(resp.insertedIds['0']).slice(-5)
      seyId = String(resp.insertedIds['1']).slice(-5)
      done()
    })
  });
  // Add tests here
  it('Should give an authorization error', function (done) {
    request(app).post('/api/snippet/create')
    .auth("brad", "test")
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
      reySnipId = res.body.id
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
      seySnipId = res.body.id
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
          "id": reySnipId,
          "snippet": "This is a sample snippet for the use of the purpose",
          "notes": "",
          "language": "english",
          "tags": ["sample", "test", "simple"]
        },
        {
          "title": "Seymour's snippet",
          "author": "Seymour",
          "id": seySnipId,
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
    request(app).get('/api/homepage/'+reySnipId)
    .auth("Reynard", "reyRey")
    .expect(200)
    .expect({
      "success": true,
      "snippet":  {
        "title": "sample snippet",
        "author": "Reynard",
        "id": reySnipId,
        "snippet": "This is a sample snippet for the use of the purpose",
        "notes": "",
        "language": "english",
        "tags": ["sample", "test", "simple"]
      }})
    .end(done)
  })
})
