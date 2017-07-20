const assert = require("assert");
const request = require("supertest");
const app = require('../app');

const Users = require('../models/users')
const Snippet = require('../models/snippet')

const userData = require('./assets/usersdb')
const snipData = require('./assets/snippetdb')

var reyId, seyId, bradId, testId

describe('GET /api/username/ - show all snippets from a particular user', function () {
  before('reset the test users collection', function(done) {
    Users.remove({}).then(function() {done()})
  });
  before('reset the test snippets collection', function(done) {
    Snippet.remove({}).then(function() {done()})
  });
  before('add users to users collection', function(done) {
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
      bradId = String(resp.insertedIds['0']);
      reyId = String(resp.insertedIds['1']);
      seyId = String(resp.insertedIds['2']);
      testId = String(resp.insertedIds['3']);
      done()
    })
  })
  before('add snippets to snippet collection', function(done) {
    Snippet.bulkWrite(
      snipData.snippets.map((x) => {
        let creator = ""
        switch (x._creator) {
          case "brad":
            creator = bradId
            break;
          case "test":
            creator = testId
            break;
          case "reynard":
            creator = reyId
            break;
          case "seymour":
            creator = seyId
            break;
          default:
            break;
        }
        return {
          insertOne: {
            document: {
              "title": x.title,
              "snippet": x.snippet,
              "notes": x.notes,
              "language": x.language,
              "_creator": creator,
              "tags": x.tags
            }
          }
        }
      })
    ).then(function () {
      done()
    })
  })
  it('Should verify snippet collection', function (done) {
    Snippet.count({}).then(function(num) {
      assert.equal(num, 5);
      done();
    })
  })
  it('Should verify users collection', function (done) {
    Users.count({}).then(function(num) {
      assert.equal(num, 4);
      done();
    })
  })
  it('Should get all snippets from brad username', function (done) {
    request(app).get('/api/users/brad')
    .auth("Reynard", "reyRey")
    .expect(200)
    .expect(function (res) {
      assert.equal(res.body.success, true);
      // assert.equal(res.body.title, 'Seymour\'s snippet');
      // seyId = res.body.id
    })
    .end(done)
  })
})
