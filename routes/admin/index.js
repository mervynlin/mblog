/**
 * Created by MervynLin on 9/21/2016.
 */
var express = require('express');
var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../../models/user.js'),
    Post = require('../../models/post.js'),
    Comment = require('../../models/comment.js');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var router = express.Router();
var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user) {
      res.render('admin/index', {title: '管理后台页面', user: req.session.user, error: req.flash('error').toString()});
  }else {
      res.redirect('/admin/login');
  }
});

router.get('/login', csrfProtection, function(req, res, next) {
    if (req.session.user) {
        res.render('admin/index', {title: '管理后台页面', user: req.session.user, error: req.flash('error').toString()});
    }
    else {
        res.render('admin/login', {
            title: 'Login Page',
            error: req.flash('error').toString(),
            csrfToken: req.csrfToken()
        });
    }
});

router.post('/login', parseForm, csrfProtection, function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.loginname, function (err, user) {
        if (!user) {
            console.log('用户不存在:' + req.body.loginname);
            req.flash('error', '用户不存在!');
            return res.redirect('/admin/login');//用户不存在则跳转到登录页
        }
        //检查密码是否一致
        if (user.password != password) {
            console.log('密码错误');
            req.flash('error', '密码错误!');
            return res.redirect('/admin/login');//密码错误则跳转到登录页
        }
        //用户名密码都匹配后，将用户信息存入 session
        req.session.user = user;
        req.flash('success', '登陆成功!');
        res.redirect('/admin');//登陆成功后跳转到主页
    });
});

router.get('/reg', function(req, res, next) {
    res.render('admin/reg', {title: 'Login Page', error: req.flash('error').toString()});
});

router.post('/reg', function (req, res) {
    var loginname = req.body.loginname,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
        console.log('error', '两次输入的密码不一致!');
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/admin/reg');//返回主册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        loginname: req.body.loginname,
        name: req.body.name,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在
    User.get(newUser.loginname, function (err, user) {
        if (user) {
            console.log('error', '用户已存在');
            req.flash('error', '用户已存在!');
            return res.redirect('/admin/reg');//返回注册页
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/admin/reg');//注册失败返回主册页
            }
            req.session.user = user;//用户信息存入 session
            req.flash('success', '注册成功!');
            res.redirect('/admin/reg');//注册成功后返回主页
        });
    });
});

router.get('/logout', function(req, res){
    console.log('退出中...');
    req.session.user = null;
    res.redirect('/admin/login');
});

module.exports = router;
