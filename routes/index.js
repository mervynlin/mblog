/**
 * Created by MervynLin on 9/21/2016.
 */
var express = require('express');
var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user) {
    res.render('index', {title: 'Login Success'});
  }else {
    res.redirect('login');
  }
});

module.exports = router;
