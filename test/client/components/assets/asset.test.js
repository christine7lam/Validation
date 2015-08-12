var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var Asset = require('../../../../src/client/components/assets/asset');

suite('Asset overview page', function() {

    var stub = require('../../stub-router-context');

    var wrapper, component, breadcrumbs, details, networks, server, routerSpy;
    suiteSetup(function() {

        //mock asset overview
        var AssetWrapper = stub(Asset, {
            ref: 'asset'
        }, {
            getCurrentParams: function() {
                return {
                    assetId: '12345'
                }
            }
        });

        //create wrapper
        wrapper = TestUtils.renderIntoDocument(
            <AssetWrapper />
        );

        //get component
        component = wrapper.refs.asset;

        //elements
        var sections = TestUtils.scryRenderedDOMComponentsWithTag(wrapper, 'ul');

        details = sections[0]
        networks = sections[1];

        breadcrumbs = TestUtils.findRenderedDOMComponentWithTag(wrapper, 'ol');

    });

    setup(function() {
        routerSpy = sinon.spy(wrapper.getChildContext().router, 'transitionTo');
    });

    teardown(function() {
        routerSpy.restore();
    });

    test('has a breadcrumbs section', function() {
        assert.isTrue(TestUtils.isDOMComponent(breadcrumbs));

        assert.equal(breadcrumbs.getDOMNode().children[0].children[0].innerText, 'Dashboard');
        assert.equal(breadcrumbs.getDOMNode().children[1].children[0].innerText, '12345');
    });

    test('has asset details', function() {
        assert.isTrue(TestUtils.isDOMComponent(details));
    });

    test('routes to the dashboard when the dashboard crumb is selected', function(done) {

        TestUtils.Simulate.click(breadcrumbs.getDOMNode().children[0].children[0]);

        setTimeout(function() {

            assert.isTrue(routerSpy.calledOnce);
            assert.isTrue(routerSpy.calledWith('dashboard'));

            done();
        }, 1);
    });

    suite('Asset details section', function() {

        suiteSetup(function() {
            server = sinon.fakeServer.create();
            server.respondImmediately = true;
        });

        suiteTeardown(function() {
            server.requests = [];
            server.restore();
        });

        setup(function() {
            component.onStoreUpdate({
                body: {"asset":{"asset":{"key":"tyco4100u","assetType":"FIREPANEL","generalConfigurationKey":"config","connectionKeys":["cell-connection","ethernet-connection"],"softwareKeys":["firmware-driver"],"sourceHierarchyLabelDescriptionKeys":["1","2","3"],"sourceKeys":["smoke1","smoke2","extender"],"interfaceControlKeys":["interface"],"assetNetworkKeys":["assetNetwork"]},"generalConfiguration":{"key":"config","serialNumber":"tyco","dateRetired":"2015-03-07T09:51:27-04:00 New_York","description":"fire panel configuration","timeZone":"PST","name":"name","dateProvisioned":"2015-03-07T09:51:27-04:00 New_York","modelType":"4100u","mac":"6d:46:08:8d:d8:58","customDetails":"{\"key\":\"value\"}","configurationVersion":"1.0","version":"1.0"},"connections":[{"key":"cell-connection","device1":"abcsd123454100u","device2":"cloud","networkKey":"network1"},{"key":"ethernet-connection","device1":"abcsd123454100u","device2":"cloud","networkKey":"network2"}],"networkIps":[{"key":"network1","ipAddress":"74.72.1.23","netmask":"255.255.255.0","networkType":"cellular"},{"key":"network2","ipAddress":"75.72.1.23","netmask":"255.255.255.0","networkType":"ethernet"}],"softwares":[{"key":"firmware-driver","name":"TycoSoft","checksum":"0123456789abcdef","description":"firepanel firmware driver","customDetails":"{\"key\":\"value\"}","target":"card 1","version":"1.0"}],"sourceHierarchyLabelDescriptions":[{"key":"1","description":"point","level":1},{"key":"2","description":"zone","level":2},{"key":"3","description":"sector","level":3}],"sources":[{"key":"smoke1","name":"Smoke detector 1","parentSourceKey":"extender","labelKeys":["label2"]},{"key":"smoke2","name":"Smoke detector 2","parentSourceKey":"extender","labelKeys":["label3","label4"]},{"key":"extender","name":"Smoke detector","childSourceKeys":["smoke1","smoke2"],"labelKeys":["label1"]}],"labels":[{"key":"label2","address":"M1-24","level":1,"description":"Smoke detector outside"},{"key":"label3","address":"E05","level":2,"description":"First floor hall"},{"key":"label4","address":"S003","level":3,"description":"West wing"},{"key":"label1","address":"M1-23","level":1,"description":"Smoke detector lobby"}],"interfaceControls":[{"key":"interface","name":"reset","customDetails":"{\"key\":\"value\"}","description":"reset a panel","type":"function"}],"assetNetworks":[{"key":"assetNetwork" ,"networkType":"NGN","nodeId":"1234","nodeType":"someType","description":"The next generation network attached to the firepanel"}]}}
            });
        });

        test('unblocks the ui on store update', function() {
            assert.isFalse(component.state.isBlocked);
        });

        test('has a populated asset state', function() {
            assert.deepEqual(component.state.asset, {"asset":{"key":"tyco4100u","assetType":"FIREPANEL","generalConfigurationKey":"config","connectionKeys":["cell-connection","ethernet-connection"],"softwareKeys":["firmware-driver"],"sourceHierarchyLabelDescriptionKeys":["1","2","3"],"sourceKeys":["smoke1","smoke2","extender"],"interfaceControlKeys":["interface"],"assetNetworkKeys":["assetNetwork"]},"generalConfiguration":{"key":"config","serialNumber":"tyco","dateRetired":"2015-03-07T09:51:27-04:00 New_York","description":"fire panel configuration","timeZone":"PST","name":"name","dateProvisioned":"2015-03-07T09:51:27-04:00 New_York","modelType":"4100u","mac":"6d:46:08:8d:d8:58","customDetails":"{\"key\":\"value\"}","configurationVersion":"1.0","version":"1.0"},"connections":[{"key":"cell-connection","device1":"abcsd123454100u","device2":"cloud","networkKey":"network1"},{"key":"ethernet-connection","device1":"abcsd123454100u","device2":"cloud","networkKey":"network2"}],"networkIps":[{"key":"network1","ipAddress":"74.72.1.23","netmask":"255.255.255.0","networkType":"cellular"},{"key":"network2","ipAddress":"75.72.1.23","netmask":"255.255.255.0","networkType":"ethernet"}],"softwares":[{"key":"firmware-driver","name":"TycoSoft","checksum":"0123456789abcdef","description":"firepanel firmware driver","customDetails":"{\"key\":\"value\"}","target":"card 1","version":"1.0"}],"sourceHierarchyLabelDescriptions":[{"key":"1","description":"point","level":1},{"key":"2","description":"zone","level":2},{"key":"3","description":"sector","level":3}],"sources":[{"key":"smoke1","name":"Smoke detector 1","parentSourceKey":"extender","labelKeys":["label2"]},{"key":"smoke2","name":"Smoke detector 2","parentSourceKey":"extender","labelKeys":["label3","label4"]},{"key":"extender","name":"Smoke detector","childSourceKeys":["smoke1","smoke2"],"labelKeys":["label1"]}],"labels":[{"key":"label2","address":"M1-24","level":1,"description":"Smoke detector outside"},{"key":"label3","address":"E05","level":2,"description":"First floor hall"},{"key":"label4","address":"S003","level":3,"description":"West wing"},{"key":"label1","address":"M1-23","level":1,"description":"Smoke detector lobby"}],"interfaceControls":[{"key":"interface","name":"reset","customDetails":"{\"key\":\"value\"}","description":"reset a panel","type":"function"}],"assetNetworks":[{"key":"assetNetwork" ,"networkType":"NGN","nodeId":"1234","nodeType":"someType","description":"The next generation network attached to the firepanel"}]});
        });
    });

});