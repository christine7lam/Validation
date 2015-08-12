var React = require('react');

var merge = require('classnames');

var DropdownMenu = React.createClass({
    propTypes: {
        pullRight: React.PropTypes.bool,
        onSelect: React.PropTypes.func
    },
    render: function() {

        var classes = {
            'dropdown-menu': true
        };

        return (
            <ul {...this.props} className={ merge(this.props.className, classes) } role="menu">
                {this.props.children}
            </ul>
        );
    }
});

module.exports = DropdownMenu;