module.exports.listen = function(app) {

    var server = require('http').createServer(app);
    var io = require('socket.io').listen(server);
    var crypto = require('crypto');

    //@todo move this to configuration
    server.listen(8080);

    io.sockets.on('connection', function (socket) {

        if (socket.request.session == null || socket.request.session.data == null) {
            return;
        }

        var token = socket.request.session.data.token;
        var user = socket.request.session.data.user;
        var service = require('./services/directory');

        var digest = null,
        interval = setInterval(function() {

            var sha = crypto.createHash('sha1');

            service.getAssets(token, user).spread(function(response) {

                if (typeof response.body === 'undefined') {
                    response.body = '';
                }

                if (response.statusCode === 200) {
                    fingerprint = sha.update(JSON.stringify(response.body)).digest('hex');

                    console.log('directory fingerprint: ' + fingerprint);

                    if (fingerprint !== digest) {
                        digest = fingerprint;
                        io.emit('update');
                    }
                }
            });

        }, 60000);

        socket.on('disconnect', function () {
            clearInterval(interval);
        });
    });

    return io;
}