/**
 * Created by heipakchristine on 7/28/15.
 */

var React = require('react');
var Reflux = require('reflux');

//actions
var ValiActions = require('../../actions/validation');
var MessagingActions = require('../../actions/messaging');

//stores
var ValiStore = require('../../stores/validation');

var Validator = React.createClass({
    mixins: [Reflux.ListenerMixin],
    getInitialState: function() {
        return {
            isSubmitting: false,
            jsonString: {
                topic: null,
                port: null,
                serverName: null,
                message: null,
                qos: null,
                clientId: null
            }
        };
    },
    componentDidMount: function() {
        this.listenTo(ValiStore, this._onValidate);
    },
    clearString: function(input){
        var output = input.replace(/(\r\n|\n|\r)/gm,"");
        output = output.replace(/\s+/g,"");
        output = output.replace(/\\\//g, "");
        try {
            output = JSON.parse(output);
        }catch(exception){
            MessagingActions.alert('Error while parsing JSON : check json format', 500000);
        }

        return output;
    },
    submitForm: function(event) {
        event.preventDefault();

        this.setState({
            isSubmitting: true
        });

        var jsonString = {
            topic: this.refs.topic.getDOMNode().value,
            port: this.refs.port.getDOMNode().value,
            serverName: this.refs.host.getDOMNode().value,
            message: this.clearString(this.refs.json.getDOMNode().value),
            qos: this.refs.qos.getDOMNode().value,
            clientId: this.refs.clientid.getDOMNode().value

        }

        this.setState({
            jsonString: jsonString
        });

        ValiActions.validate(jsonString);
    },
    render: function() {

        return (

            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-md-centered text-center">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3>Tyco ON Data Model JSON Validator</h3>
                            </div>
                            <div className="panel-body">
                                <label>Validate your JSON before reaching the parser</label>
                                <form className="form-horizontal validator" onSubmit={this.submitForm}>
                                    <div className="form-group col-md-4">
                                        <input type="text" className="form-control" id="host" ref="host" placeholder="Host" required />
                                    </div>
                                    <div className="form-group col-md-2">
                                        <input type="text" className="form-control" id="port" ref="port" placeholder="Port" required />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <select className="form-control" id="topic" ref="topic" required>
                                            <option>Select a topic</option>
                                            <option>device_discovery</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-md-2">
                                        <select className="form-control" id="qos" ref="qos" required>
                                            <option>Select a Qos</option>
                                            <option>0</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <input type="text" className="form-control" id="clientid" ref="clientid" placeholder="Client ID" required />
                                    </div>
                                    <br/>
                                    <div className="form-group col-md-12">
                                        <textarea className="form-control" id="json" ref="json" rows="15" placeholder="JSON" required />
                                    </div>
                                    <br/>
                                    <div className="form-group col-md-3">
                                        <button type="submit" className="btn btn-lg btn-primary btn-block" disabled={this.state.isSubmitting}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    _onValidate: function(data) {


        this.setState({
            isSubmitting: false
        });

        if (data.status === 200) {

            MessagingActions.alert('Request Successful : 200', 500000);

        } else if (data.status === 400 || data.status === 401) {

            MessagingActions.alert('Invalid Input, please check : 400 \n Error:  '+data.response.body.error, 50000);

        }
        else if (data.status === 500) {

            MessagingActions.alert('Internal Server Error, please check : 500 \n Error:  '+data.response.body.error, 50000);

        }
    }
});

module.exports = Validator;
