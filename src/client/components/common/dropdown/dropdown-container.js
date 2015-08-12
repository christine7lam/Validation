var React = require('react');
var EventListener = require('../../common/events');

var merge = require('classnames');

var DropdownContainer = React.createClass({
    getInitialState: function() {
        return {
            open: false
        }
    },
    render: function() {
        var renderMethod = (this.props.type === 'li') ? 'renderListItem' : 'renderDiv';

        return this[renderMethod]();
    },
    renderListItem: function() {
        return (
            <li className={merge({
                'dropdown': true,
                'open': this.state.open
            })}>
                {this.props.children.map(this.renderChild)}
            </li>
        );
    },
    renderDiv: function() {
        return (
            <div className={merge({
                'dropdown': true,
                'open': this.state.open
            })}>
                {this.props.children.map(this.renderChild)}
            </div>
        );
    },
    renderChild: function(child) {

        if (child.type.displayName === 'DropdownTrigger') {
            return React.cloneElement(child, {
                onClick: this.handleDropdownClick
            });
        }

        if (child.type.displayName === 'DropdownMenu') {
            return React.cloneElement(child, {
                onClick: this.handleOptionSelect
            });
        }

        return child;
    },

    //events
    handleDropdownClick: function() {

        var open = !this.state.open;

        //toggle
        this.setState({
            open: open
        });

        //binds
        if (open) {
            this.unbind = EventListener.listen(document, 'click', this.handleDocumentClick);
        } else {
            this.unbind.remove();
        }

    },
    handleDocumentClick: function(event) {
        if (this._isNodeInRoot(event.target, React.findDOMNode(this))) {
            return;
        }

        this.setState({
            open: false
        });
    },
    handleOptionSelect: function(event) {
        this.setState({
            open: false
        });
    },

    //helpers
    _isNodeInRoot(node, root) {
        while (node) {
            if (node === root) {
                return true;
            }

            node = node.parentNode;
        }

        return false;
    },

    //callbacks
    componentWillUnmount: function() {
        if (typeof this.unbind !== 'undefined') {
            this.unbind.remove();
        }
    }
});

module.exports = DropdownContainer;