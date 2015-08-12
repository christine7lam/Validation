var React = require('react');

var merge = require('classnames');

var DropdownItem = React.createClass({
    getDefaultProps: function() {
        return {
            href: '#'
        };
    },
    render: function() {

        var children = null, classes = {
            'dropdown-header': this.props.header,
            'divider': this.props.divider
        };

        if (this.props.header) {
            children = this.props.children;
        } else if (!this.props.divider) {
            children = this.renderAnchor();
        }

        return (
            <li {...this.props} role="presentation">
                {children}
            </li>
        );
    },
    renderAnchor: function() {
        return (
            <a onClick={this.handleClick} href={this.props.href} target={this.props.target} name={this.props.name}>
                {this.props.children}
            </a>
        );
    },
    handleClick: function(event) {
        //console.log(event);
        if (this.props.onSelect) {
            event.preventDefault();
            this.props.onSelect(event);
        }
    }
});

module.exports = DropdownItem;