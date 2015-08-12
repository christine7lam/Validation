var app = require('../main');
var express = require('express');
var router = express.Router();

router.get(
    ['/', '/register', '/validation', '/login', '/notifications', '/challenge',
        '/settings', '/settings/summary', '/settings/security', '/settings/profile',
            '/assets', '/asset/*'
    ],
    function(req, res) {
        res.render('index', { title: 'Device Manager' });
    }
);

module.exports = router;