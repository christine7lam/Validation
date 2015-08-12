var React = require('react');

var UserOptions = require('./user-options');

var Header = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function() {

        var userOptions;
        if (this.props.user.username != null) {
            userOptions = (
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="javascript:;">{this.props.user.firstName} {this.props.user.lastName}</a></li>
                    <UserOptions onOptionSelect={this.handleOptionSelect} />
                </ul>
            );
        }

        return (
            <nav className="navbar navbar-inverse">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="/">Tyco On</a>
                    </div>
                    <div className="navbar-collapse collapse">
                        {userOptions}
                    </div>
                </div>
            </nav>
        );
    },
    handleOptionSelect: function(name) {

        if (name === 'logout') {
            return this.props.onLogout();
        }

        this.context.router.transitionTo(name);
    }
});

module.exports = Header;