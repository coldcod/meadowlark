var express = require('express');var fs = require('fs');var fortune = require('./lib/fortune.js');var currentTime = require('./lib/time.js').getTime();var app = express();var date = new Date();var currentDate = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();var time = currentTime + ' on ' + currentDate;/* setting up handlebars view engine */var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });app.engine('handlebars', handlebars.engine);app.set('view engine', 'handlebars');app.set('port', process.env.PORT || 8080);app.use(express.static(__dirname + '/public'));app.use(function(req, res, next) {  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';  next();})/* setting up pages on specific routes */app.get('/', function(req, res){  res.render('home', { mdpath: 'home.js' });});app.get('/about', function(req, res){  res.render('about', {    fortune: fortune.getFortune(),    pageTestScript: '/qa/tests-about.js'  });});app.get('/contact', function(req, res) {  res.render('contact');});app.get('/tours/hood-river', function(req, res) {  res.render('tours/hood-river', {pageTestScript: './qa/tests-crosspage.js'});});app.get('/tours/oregon-coast', function(req, res) {  res.render('tours/oregon-coast');});app.get('/tours/request-group-rate', function(req, res){  res.render('tours/request-group-rate');});/* custom 404 page */app.use(function(req, res){  res.status(404);  res.render('404');});/* custom 500 page */app.use(function(err, req, res, next){  console.error(err.stack);  res.status(500);  res.render('500');});/* starting server */app.listen(app.get('port'), function(){  console.log( 'Express started on http://localhost:' +        app.get('port') + ' at ' + time + '; press Ctrl-C to terminate.' );});

