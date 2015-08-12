var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var io = require('socket.io-client');

var RouteHandler = Router.RouteHandler;

//components
var Header = require('./header/header');
var AlertHandler = require('./common/alert-handler');

var Application = React.createClass({
    mixins: [Reflux.ListenerMixin],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            user: {}
        };
    },
    componentDidMount: function() {

        var currentPath = this.context.router.getCurrentPath();

    },
    render: function() {
        return (
            <div className="app">
                <Header
                    user={this.state.user}
                    onLogout={this.logout} />
                <AlertHandler />
                <RouteHandler user={this.state.user} />
            </div>
        );
    },
    logout: function() {

    }
});

module.exports = Application;