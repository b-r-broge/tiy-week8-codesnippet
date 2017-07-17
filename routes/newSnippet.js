const express = require('express');
const router = express.Router();
const passport = require('passport');

const Users = require('../models/users');
const Snippet = require('../models/snippet')

router.post('/create', function(req, res) {
  // create a new snippet
  var newSnippet = new Snippet({
    "title": req.body.title,
    "snippet": req.body.snippet,
    "notes": req.body.notes,
    "language": req.body.language,
    "tags": req.body.tags,
    "_creator": req.user._id
  })
  newSnippet.save().then(function(snip) {
    // console.log('added snippet', snip);
    return res.json({
      "success": true,
      "title": snip.title
    })
  }).catch(function (err) {
    console.log('error saving new snippet', err);
    return res.json({
      "success": false,
      "error": err
    })
  })
})

module.exports = router;
