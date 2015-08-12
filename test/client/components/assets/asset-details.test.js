var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var AssetDetails = require('../../../../src/client/components/assets/asset-details');

suite('Asset details component', function() {

    var component, edit, onSaveSpy, saveSpy, toggleSpy;
    setup(function() {

        var asset = {"blacklisted":false,"dateProvisioned":"2015-02-09","description":"","deviceType":"GATEWAY","firstHeartbeat":"","groupId":0,"hardwareVersion":"0.1","lastKnownHeartbeat":"","mac":"C4-D8-67-48-34-33","manufacturer":"michaelsoft","modelNumber":"4100U","name":"","path":"","registrationId":"","serialNumber":"test00","softwareVersion":"nick","status":"disconnected - panel offline","statusColor":"GREEN","templateUrl":"localhost","tenantId":0,"uuid":"00000000000000000000000000000000"};

        onSaveSpy = sinon.spy();

        component = TestUtils.renderIntoDocument(
            <AssetDetails asset={asset} onSave={onSaveSpy} />
        );

        //elements
        edit = TestUtils.findRenderedDOMComponentWithTag(component, 'button');

        //spies
        saveSpy = sinon.spy(component, 'save');
        toggleSpy = sinon.spy(component, 'toggleEditable');
    });

    teardown(function() {
        saveSpy.restore();
        toggleSpy.restore();
    });

    test('is a React component', function() {
        assert.isTrue(TestUtils.isCompositeComponent(component));
    });

    test('receives an asset via props', function() {
        assert.deepEqual(component.props.asset, {"blacklisted":false,"dateProvisioned":"2015-02-09","description":"","deviceType":"GATEWAY","firstHeartbeat":"","groupId":0,"hardwareVersion":"0.1","lastKnownHeartbeat":"","mac":"C4-D8-67-48-34-33","manufacturer":"michaelsoft","modelNumber":"4100U","name":"","path":"","registrationId":"","serialNumber":"test00","softwareVersion":"nick","status":"disconnected - panel offline","statusColor":"GREEN","templateUrl":"localhost","tenantId":0,"uuid":"00000000000000000000000000000000"});
    });

    test('exposes an edit button', function() {
        assert.isTrue(TestUtils.isDOMComponent(edit));
        assert.equal(edit.getDOMNode().innerText, 'Edit');
    });

    test('exposes editable input fields when the edit button is clicked', function() {
        TestUtils.Simulate.click(edit);

        var input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

        assert.isTrue(TestUtils.isDOMComponent(input));
    });

    test('exposes a save and cancel button when the edit button is clicked', function() {
        TestUtils.Simulate.click(edit);

        var buttons = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        assert.equal(buttons[0].getDOMNode().innerText, 'Save');
        assert.equal(buttons[1].getDOMNode().innerText, 'Cancel');
    });

    test('reverts to readonly mode when the edit mode cancel button is clicked', function() {

        TestUtils.Simulate.click(edit);

        var buttons = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        TestUtils.Simulate.click(buttons[1]);

        //@todo why is this only called once?
        assert.isTrue(toggleSpy.calledOnce);
    });

    test('saves the editable asset fields with the edit mode save button is clicked', function() {

        TestUtils.Simulate.click(edit);

        var input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        var buttons = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button');

        input.getDOMNode().value = 'Test Asset';
        TestUtils.Simulate.click(buttons[0]);

        assert.isTrue(saveSpy.calledOnce);
        assert.isTrue(onSaveSpy.calledOnce);
        assert.isTrue(onSaveSpy.calledWith({
            name: 'Test Asset',
            uuid: '00000000000000000000000000000000'
        }));
    });
});