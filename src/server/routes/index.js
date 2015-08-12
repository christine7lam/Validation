var app = require('../main');

//routes map
var pages = require('./pages');
var validate = require('./validate');

module.exports = function(app) {

    //track requests
    app.use(function(req, res, next) {
        app.locals.statsd.increment('tycoon.ui.requests');
        next();
    });

    app.use('/', pages);
    app.use('/services/validate', validate);
}