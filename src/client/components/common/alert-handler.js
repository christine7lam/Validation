var React = require('react');
var Reflux = require('reflux');

//stores
var MessagingStore = require('../../stores/messaging');

//components
var Alert = require('react-bootstrap').Alert;

var alertHandler = React.createClass({
    mixins: [Reflux.ListenerMixin],
    getInitialState: function() {
        return {
            alerts: []
        };
    },
    componentDidMount: function() {
        this.listenTo(MessagingStore, this._onMessageAlert);
    },
    render: function() {

        var alerts = [];
        if (this.state.alerts.length > 0) {
            this.state.alerts.forEach(function(alert, index) {
                alerts.push(
                    <Alert key={index} bsStyle="warning">
                        <span>{alert.body}</span>
                    </Alert>
                );
            });
        }

        return (<div className="container">{alerts}</div>);
    },
    _onMessageAlert: function(alerts) {
        this.setState({
            alerts: alerts
        });
    }
});

module.exports = alertHandler;