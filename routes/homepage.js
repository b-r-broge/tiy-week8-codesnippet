const express = require('express');
const router = express.Router();
const passport = require('passport');

const Users = require('../models/users');

router.get('/check', function(req, res) {
  res.json({
    "success": true,
    "username": req.user.username
  })
})

module.exports = router;
