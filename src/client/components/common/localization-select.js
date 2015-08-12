var React = require('react');

var DropdownContainer = require('../common/dropdown/dropdown-container');
var DropdownTrigger = require('../common/dropdown/dropdown-trigger');
var DropdownMenu = require('../common/dropdown/dropdown-menu');
var DropdownItem = require('../common/dropdown/dropdown-item');

var LocalizationSelect = React.createClass({
    getInitialState: function() {
        return {
            locale: 'en-US',
            allLocales: [
                { name: 'English (United States)', code: 'en-US' }
            ]
        }
    },
    componentWillReceiveProps: function(props) {
        this.setState({
            locale: this._getSelectedLocale(props.selected, props.allLocales),
            allLocales: props.allLocales
        });
    },
    render: function() {

        var self = this;

        var options = [];
        this.props.allLocales.map(function(locale, index) {
            options.push(<DropdownItem name={locale.code} key={index} onSelect={self.handleOptionSelect}>{locale.name}</DropdownItem>);
        });

        return (
            <div>
                <DropdownContainer>
                    <DropdownTrigger type="button" className="btn btn-block btn-default text-left" key={1}>
                        {this.state.locale.name}
                    </DropdownTrigger>
                    <DropdownMenu ref="menu" key={2}>
                        {options}
                    </DropdownMenu>
                </DropdownContainer>
            </div>
        );
    },
    handleOptionSelect: function(event) {

        var selected = {
            locale: {
                name: event.target.textContent,
                code: event.target.name
            }
        };

        this.setState(selected);

        if (typeof this.props.onSelect !== 'undefined') {
            this.props.onSelect(selected);
        }
    },
    _getSelectedLocale: function(code, allLocales) {

        var out = {
            name: 'English (United States)',
            code: 'en-US'
        };

        if (typeof code !== 'undefined') {
            allLocales.forEach(function(locale) {
                if (code === locale.code) {
                    out = {
                        name: locale.name,
                        code: locale.code
                    };

                    return;
                }
            });
        }

        return out;
    }
});

module.exports = LocalizationSelect;