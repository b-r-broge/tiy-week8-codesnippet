const express = require('express');
const router = express.Router();

const Users = require('../models/users');
const Snippet = require('../models/snippet')


router.get('/users/:username', function (req, res) {
  Snippet.find().populate('_creator')
  .then(function (snippets) {
    var userSnippets = snippets.filter((x) => {
      if (x._creator.username === req.params.username) { return true;}
    })
    // var tagSnippets = snippets.filter((a) => {
    //   return a.tags.includes(req.params.tag)
    // })
    var allSnippets = userSnippets.map((snip) => {
      return {
        "id": snip._id.toString(),
        "title": snip.title,
        "author": snip._creator.username,
        "snippet": snip.snippet,
        "notes": snip.notes,
        "language": snip.language,
        "tags": snip.tags
      }
    })
    return res.json({
      "success": true,
      "snippets": allSnippets
    })
  })
  .catch(function (err) {
    console.log('error finding all snippets by one user', err);
    return res.json({
      "success": false,
      "error": err
    })
  })
})


module.exports = router;
