/**
 * Created by heipakchristine on 7/28/15.
 */
var app = require('../main');
var express = require('express');
var promise = require('bluebird');

var router = express.Router();

//promises
var request = promise.promisifyAll(require('request'));

//data service
var service = require('../services/validate');

router.post('/', function(req, res) {

    if (typeof req.body.data === 'undefined') {
        return res.status(400).end();
    }

    try {
        service.validate(req.body.data).spread(function(response) {

            if (response.statusCode === 200) {
                return res.status(200).end();
            }

            return res.status(response.statusCode).json({
                error: response.body
            }).end();

        }, function(error, response) {
            return res.status(response.statusCode).end();
        });

    } catch(e) {
        return res.status(500).json({
            error: e,
            message: 'There was a problem processing your request, please try again shortly'
        });
    }
});

module.exports = router;