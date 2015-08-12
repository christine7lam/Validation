var React = require('react');

var merge = require('classnames');

var DropdownTrigger = React.createClass({
    _classes: {
        'dropdown-toggle': true
    },
    render: function() {
        var renderMethod = (this.props.type === 'glyph') ? 'renderGlyph' :
            (this.props.type === 'button') ? 'renderButton' :
                'renderAnchor';

        return this[renderMethod]();
    },
    renderGlyph() {
        return (
            <span {...this.props} onClick={this.props.onClick}></span>
        );
    },
    renderButton() {
        return (
            <button {...this.props} onClick={this.props.onClick} className={ merge(this.props.className, this._classes) }>
                {this.props.children}
            </button>
        );
    },
    renderAnchor() {
        return (
            <a {...this.props} onClick={this.props.onClick} href="javascript:;" className={ merge(this.props.className, this._classes) }>
                {this.props.children}
            </a>
        );
    }
});

module.exports = DropdownTrigger;