const express = require('express');
const router = express.Router();

const Users = require('../models/users');
const Snippet = require('../models/snippet')

const homepageRoute = require('./homepage')
const newSnippet = require('./newSnippet')

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const localStrategy = require('passport-local').Strategy;
const bCrypt = require('bcryptjs');

// taken and slightly modified from -
// https://github.com/jaredhanson/passport-http
// AND
// https://www.npmjs.com/package/bcryptjs
passport.use('basic', new BasicStrategy(
  function(user, password, done) {
    var isValid = (usrPass, pass) => {
      return bCrypt.compareSync(pass, usrPass);
    }
    Users.findOne({
      username: user
    }, function(err, user) {
       if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!isValid(user.password, password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

router.post('/signup', function(req, res) {
  // Take an api request with username and password,
  // calculate uuid, and then add them to the database
  // res.json({"incomplete": true})
  Users.count({}, function(err, num) {
    var newUser = new Users({
      "username": req.body.username,
      "password": req.body.password,
    })
    newUser.save().then(function(user) {
      res.json({
        "success": true,
        "newUsername": req.body.username
      })
    }).catch(function(err) {
      console.log('ERROR', err);
      res.json({
        "success": false,
        "error": err
      })
    })
  })
})

// authenticate before using the API routes
router.use( passport.authenticate('basic', {
  session: false
}), homepageRoute);
router.use('/snippet', passport.authenticate('basic', {
  session: false
}), newSnippet);

module.exports = router;
