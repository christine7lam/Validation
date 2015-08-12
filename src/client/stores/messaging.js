var Reflux = require('reflux');
var MessagingActions = require('../actions/messaging');

var uuid = require('node-uuid');

var messagingStore = Reflux.createStore({
    listenables: [MessagingActions],
    _notifications: [],
    _alerts: [],

    //pubic store methods
    getNotifications: function() {
        return this._notifications;
    },
    getAlerts: function() {
        return this._alerts;
    },

    //broadcast a single alert
    onAlert: function(body, expires) {
        this._alerts = [];
        this._pushAlert(body, expires);
    },

    //broadcast a single notification
    onNotification: function(body) {
        this._notifications = [];
        this._pushNotifications([body]);
    },

    //private alert methods
    _pushAlert: function(body, expires) {
        var id = uuid.v1();

        this._alerts.push({
            id: id,
            body: body
        });

        this._broadcast(id, expires);
    },
    _spliceAlert: function(id) {
        var self = this;

        this._alerts.forEach(function(alert, index) {
            if (alert.id === id) {
                self._alerts.splice(index, 1);
            }
        });
    },
    _broadcast: function(id, expires) {
        var self = this;
        if (expires != null) {
            setTimeout(function() {
                self._spliceAlert(id);
                if (self._alerts.length > 0) {
                    self.trigger(self._alerts);
                } else {
                    self.trigger([]);
                }
            }, parseInt(expires));
        }

        this.trigger(this._alerts);
    },

    //private notification methods
    _removeNotification: function(notification) {
        for (var i = 0; i < this._notifications.length; i++) {
            if (notification.id === this._notifications[i].id) {
                this._notifications.splice(i, 1);
            }
        }

        this.trigger();
    },
    _pushNotifications: function(data) {
        for (var i = 0; i < data.length; i++) {
            this._notifications.push(data[i]);
        }

        this.trigger();
    }
});

module.exports = messagingStore;