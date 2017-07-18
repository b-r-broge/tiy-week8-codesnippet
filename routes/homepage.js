const express = require('express');
const router = express.Router();
const passport = require('passport');

const Users = require('../models/users');
const Snippet = require('../models/snippet')

router.get('/check', function(req, res) {
  res.json({
    "success": true,
    "username": req.user.username
  })
})

router.get('/homepage', function (req, res) {
  Snippet.find().populate("_creator").exec(function (err, snips) {
    if (err) {
      console.log("error finding snippets:", err);
      return res.json({
        "success": false,
        "error": err
      })
    }
    var snippetArray = []
    snips.map(function(a) {
      snippetArray.push({
        "title": a.title,
        "author": a._creator.username,
        "id": String(a._id).slice(-5),
        "snippet": a.snippet,
        "notes": a.notes,
        "language": a.language,
        "tags": a.tags
      })
    })
    // console.log(snippetArray);
    return res.json({
      "success": true,
      "snippets": snippetArray
    })
  })
})

module.exports = router;
