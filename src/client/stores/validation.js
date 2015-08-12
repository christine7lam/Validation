/**
 * Created by heipakchristine on 7/28/15.
 */
var Reflux = require('reflux');
var ValiAction = require('../actions/validation');

var request = require('superagent');

const VALIDATE_ENDPOINT = '/services/validate';

var validateStore = Reflux.createStore({
    init: function() {
        this.listenTo(ValiAction.validate, this._validate);

        this.listenTo(ValiAction.completed, this.trigger);
        this.listenTo(ValiAction.failed, this.trigger);

    },
    _validate: function(data) {
        request
            .post(VALIDATE_ENDPOINT)
            .set('Content-Type', 'application/json')
            .send({
                data: {
                    topic: data.topic,
                    port: data.port,
                    serverName: data.serverName,
                    message: data.message,
                    qos: data.qos,
                    clientId: data.clientId
                }
            })
            .end(function(err, res) {
                if (err == null) {
                    ValiAction.completed(res, data);
                } else {
                    ValiAction.failed(err);
                }
            });
    }
});

module.exports = validateStore;