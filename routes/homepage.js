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

module.exports = router;
