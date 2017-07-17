const assert = require("assert");
const request = require("supertest");
const app = require('../app');

const Users = require('../models/users')
const Snippet = require('../models/snippet')

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
    ]).then(function() {done()})
  });
  // Add tests here
  it('Should add a new code snippet to the database', function (done) {
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
    .expect({
      "success": true,
      "title": "sample snippet"
    })
    .end(done)
  })
})
