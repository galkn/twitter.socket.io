var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cronJob = require('cron').CronJob;
var _ = require('underscore');
var Twit = require('twit');

var routes = require('./routes/index');
var users = require('./routes/users');

var app    = express()
  , http   = require('http')
  , server = http.createServer(app)
  , io     = require('socket.io').listen(server);
server.listen(8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

var T = new Twit({
    consumer_key:         'nHruFGIrCAyR1EIgLpHdS047A'
  , consumer_secret:      'Eh4OVePjybvu86hFNAgH4fd7CZepZ49MIfqJBBvj04bvlWCyFi'
  , access_token:         '177306009-TPGn1ogHhfxve8AvONQozsBXrsvyQL3ySSWG0MyQ'
  , access_token_secret:  'kda2ekGGgsIK9rE8EJD1yOh7CLxV8JW8oB9eicjkjMpl3'
});

io.sockets.on('connection', function (socket) {

	var stream = T.stream('statuses/sample');
	//var stream = T.stream('statuses/filter', { track: 'obama'});

	stream.on('tweet', function (tweet) {
		socket.emit('tweet', tweet);
	});
});
