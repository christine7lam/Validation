/**
 * Created by heipakchristine on 7/28/15.
 */
var url = require('url');

var app = require('../main');
var promise = require('bluebird');
var request = promise.promisifyAll(require('request'));

module.exports = {

    validate: function(data) {

        var DIRECTORY_ENDPOINT = getUri('/ingestservice/rest/discovery/');

        return request.postAsync(DIRECTORY_ENDPOINT, {
            json: true,
            time: true,
            body: {
                topic: data.topic,
                port: data.port,
                serverName: data.serverName,
                message: data.message,
                qos: data.qos,
                clientId: data.clientId
            }
        });

    }
};

function getUri(path) {

    var dataModelConfig = app.locals.config.get('endpoints').datamodel;

    return app.locals.config.createUri({
        protocol: 'http',
        host: dataModelConfig.host,
        port: dataModelConfig.port,
        path: path
    });
}