// libs
var path = require('path');

//express
var express = require('express');
var serve = require('serve-static');
var morgan = require('morgan');
var session = require('express-session');
var redis = require('connect-redis')(session);

// includes
var configuration = require('./config/config');
var locale = require('./helpers/locale');
var i18n = require('./helpers/internationalization');

// parsers
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// start app; assign to exports for circular dependencies
var app = module.exports = express();

// start socket server
var io = require('./io').listen(app);

// set configuration
var config = configuration.init({
    env: app.get('env')
});

// statsd
var statsd = require('node-statsd');

app.locals.config = config;
app.locals.config.isWindows = /^win/.test(process.platform);
app.locals.statsd = new statsd({
    host: app.locals.config.get('statsd').host,
    port: app.locals.config.get('statsd').port
});

// remove header
app.set('x-powered-by', false);

// register view engine
app.set('views', path.join(__dirname, '../../build'));
app.set('view engine', 'ejs');

// app middleware
app.use(serve(path.join(__dirname, '../../build'))); //static assets
app.use(morgan('dev')); //logs
app.use(cookieParser());
app.use(bodyParser.json()); //json parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(locale(i18n.locales.getSupportedCodes()));

// session middleware
var sessionMiddleware;
if (app.locals.config.isWindows) {
    sessionMiddleware = session({
        secret: config.get('express').session.secret,
        resave: false,
        saveUninitialized: false
    });
} else {
    sessionMiddleware = session({
        store: new redis({
            host: config.get('express').session.host,
            port: config.get('express').session.port,
            prefix: config.get('express').session.prefix,
            ttl: config.get('express').session.ttl
        }),
        secret: config.get('express').session.secret,
        resave: false,
        saveUninitialized: false
    });
}

// io sessions
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

// sessions
app.use(sessionMiddleware);

// routes
require('./routes/index')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//error page
app.use(function(err, req, res, next) {

    if (app.get('env') !== 'production') {
        //require('request').debug = true;
    }

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: (app.get('env') !== 'production') ? err : {}, //errors on non-prod
        routes: (app.get('env') !== 'production') ? JSON.stringify(app._router.stack) : {} //routes on non-prod
    });
});