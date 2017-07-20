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
      "title": snip.title,
      "id": String(snip._id)
    })
  }).catch(function (err) {
    console.log('error saving new snippet', err);
    return res.json({
      "success": false,
      "error": err
    })
  })
})

router.get('/:id', function (req, res) {
  Snippet.findOne({_id: req.params.id}).populate("_creator").then((snip) => {
    // console.log(snip);
    var outData = {
      "id": snip._id.toString(),
      "title": snip.title,
      "author": snip._creator.username,
      "snippet": snip.snippet,
      "notes": snip.notes,
      "language": snip.language,
      "tags": snip.tags
    };
    return res.json({
      "success": true,
      "snippet": outData
    });
  }).catch((err) => {
    console.log('error finding snippet', err);
    return res.json({
      "success": false,
      "error": err
    })
  })
})

module.exports = router;
