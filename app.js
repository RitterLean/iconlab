var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var index = require('./routes/index');
var uploads = require('./routes/uploads');
var auth = require('basic-auth')

var app = express();
// var mongoURI = "mongodb://localhost:27017/images"; // replace with your mongodb url

// var MongoDB = mongoose.connect(mongoURI).connection;


app.use(function(req, res, next) {
  var user = auth(req);

  if (user === undefined || user['name'] !== 'iconlab' || user['pass'] !== 'session') {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
      res.end('Unauthorized');
  } else {
      next();
  }
});

var MongoDB = mongoose.connect('mongodb://localhost:27017/images', {
  useMongoClient: true,
  /* other options */
});

MongoDB.on('error', function (err) {
  if (err) {
    console.log('mongodb connection error', err);
  } else {
    console.log('mongodb connection successful');
  }
});

MongoDB.once('open', function () {
  console.log('mongodb connection open');
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// set up routes
app.use(express.static('public'));
app.use('/', index);
app.use('/uploads', uploads);

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Listening on port: ', port);
});

module.exports = app;