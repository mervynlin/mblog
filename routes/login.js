/**
 * Created by MervynLin on 9/21/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('login', {title: 'Login Page'});
});

module.exports = router;
