var express = require('express');
var fs = require('fs');
var fortune = require('./lib/fortune.js');
var weather = require('./lib/weather.js').getWeatherData();
var currentTime = require('./lib/time.js').getTime();
var app = express();
var date = new Date();
var currentDate = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
var time = currentTime + ' on ' + currentDate;
var bodyparser = require('body-parser');
var http = require('http'), server = http.createServer(app);

var urlencodedparser = bodyparser.urlencoded({ extended: false });

/* setting up handlebars view engine and adding sections */
var handlebars = require('express3-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

app.engine('handlebars', handlebars.engine);
app.set('host', 'meadowlark.local')
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public'));
//app.use(bodyparser());
app.use(function(req, res, next) {
      	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
      	next();
});
app.use(function(req, res, next){
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weather = weather;
  next();
});


/* setting up pages on specific routes */
app.get('/', function(req, res){
      	res.render('home');
});
app.get('/about', function(req, res){
      	res.render('about', {
	    	fortune: fortune.getFortune(),
	    	pageTestScript: '/qa/tests-about.js'
      	});
});
app.get('/contact', function(req, res) {
      	res.render('contact', {layout: "contact"});
});
app.get('/tours/hood-river', function(req, res) {
      	res.render('tours/hood-river', {pageTestScript: './qa/tests-crosspage.js'});
});
app.get('/tours/oregon-coast', function(req, res) {
      	res.render('tours/oregon-coast');
});
app.get('/tours/request-group-rate', function(req, res){
      	res.render('tours/request-group-rate');
});

/*  -- TESTS ONLY. TO BE REMOVED BEFORE PRODUCTION RELEASE --  */
// START OF TESTS

/* header info */
app.get('/headers-t', function(req, res){
  res.set('Content-Type', 'text/plain');
  var s = '';
  for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
  res.send(s);
});
app.get('/info-t', function(req, res){
  res.render('tours/request-group-rate');
});
app.post('/contact-t', urlencodedparser, function(req, res){
  console.log('\nname: ' + req.body.name + '\nemail: ' + req.body.email);
  res.send(req.body.groupSize);
});

// END OF TESTS

// disabling 'x-powered-by', a response header containing the name of the server being used
app.disable('x-powered-by');

/* custom 404 page */
app.use(function(req, res){
      	res.status(404);
      	res.render('404');
});
/* custom 500 page */
app.use(function(err, req, res, next){
      	console.error(err.stack);
      	res.status(500);
      	res.render('500');
});


/* starting server */
app.listen(app.get('port'), app.get('host'), function(){
      	console.log( 'Express started on http://' + app.get('host') + ":" + app.get('port') + ' at ' + time + '; press Ctrl-C to terminate' );
});
/*server.listen(app.get('port'), app.get('host'), function() {
  console.log("running");
})*/
