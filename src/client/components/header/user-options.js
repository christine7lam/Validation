var React = require('react');

var DropdownContainer = require('../common/dropdown/dropdown-container');
var DropdownTrigger = require('../common/dropdown/dropdown-trigger');
var DropdownMenu = require('../common/dropdown/dropdown-menu');
var DropdownItem = require('../common/dropdown/dropdown-item');

var console = require('../common/console');

var UserOptions = React.createClass({
    render: function() {
        return (
            <DropdownContainer type="li">
                <DropdownTrigger type="anchor" key={1}>
                    <span className="glyphicon glyphicon-user"></span>
                </DropdownTrigger>
                <DropdownMenu ref="menu" key={2}>
                    <DropdownItem eventKey="1" onSelect={this.handleOptionSelect} name="profile">Settings</DropdownItem>
                    <DropdownItem eventKey="2" onSelect={this.handleOptionSelect} name="logout">Logout</DropdownItem>
                </DropdownMenu>
            </DropdownContainer>
        );
    },
    handleOptionSelect: function(event) {
        this.props.onOptionSelect(event.target.name);
    }
});

module.exports = UserOptions;