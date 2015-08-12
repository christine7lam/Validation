var React = require('react');

var ButtonGroup = React.createClass({
    render: function() {
        var self = this;

        return (
            <div className="btn-group">
                {this.props.children.map(function(child, index) {

                    var classes = null;
                    if (child.props.name === self.props.selected) {
                        classes = 'active';
                    }

                    return React.cloneElement(child, {
                        className: classes,
                        onClick: self.handleClick.bind(self, child, index),
                        key: index
                    });
                })}
            </div>
        );
    },
    handleClick: function(element, index) {
        this.props.onChange(element, index);
    }
});

module.exports = ButtonGroup;