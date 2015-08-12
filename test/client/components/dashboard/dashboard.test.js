var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

suite('Dashboard component', function() {

    var Dashboard, DataActions, component, server;
    suiteSetup(function() {
        Dashboard = require('../../../../src/client/components/dashboard/dashboard');
        DataActions = require('../../../../src/client/actions/data');

        //xhr
        server = sinon.fakeServer.create();
        server.respondImmediately = true;

        //spy
        sinon.spy(DataActions, 'loadAssets');

        //capture assets call
        server.respondWith('GET', '/services/data/assets', [200, {}, '']);

        component = TestUtils.renderIntoDocument(
            <Dashboard />
        );
    });

    suiteTeardown(function() {
        DataActions.loadAssets.restore();
        server.requests = [];
        server.restore();
    });

    test('is a composite React component', function() {
        assert.isTrue(TestUtils.isCompositeComponent(component));
    });

    test('has a collection of assets', function() {
        assert.isArray(component.state.assets);
        assert.lengthOf(component.state.assets, 0);
    });

    test('has a collection of filtered assets', function() {
        assert.isArray(component.state.filteredAssets);
        assert.lengthOf(component.state.filteredAssets, 0);
    });

    test('has a defined filter', function() {
        assert.isDefined(component.state.filter);
        assert.equal(component.state.filter, 'all')
    });

    test('fires a loadAssets event when the component mounts', function() {
        assert.isTrue(DataActions.loadAssets.calledOnce);
    });

    suite('on asset filter change', function() {

        var list, table;
        setup(function() {
            list = TestUtils.findRenderedDOMComponentWithTag(component, 'ul');
            table = TestUtils.findRenderedDOMComponentWithTag(component, 'table');
        });

        test('updates the filter state', function() {
            assert.equal(component.state.filter, 'all');

            //first filter (good)
            TestUtils.Simulate.click(list.getDOMNode().children[1].children[0].children[0]);

            assert.equal(component.state.filter, 'GREEN');
        });
    });

    suite('with asset data', function() {
        setup(function() {
            component.onStoreUpdate({assets: [{"asset":{"key":"abcsd123464100u","assetType":"FIREPANEL","generalConfigurationKey":"config","assetNetworkKeys":["assetNetwork","assetNetwork2"]},"generalConfiguration":{"key":"config","name":"name"},"connections":[],"networkIps":[],"softwares":[],"sourceHierarchyLabelDescriptions":[],"interfaceControls":[],"assetNetworks":[{"key":"assetNetwork","networkType":"NGN","nodeId":"1234","nodeType":"someType","description":"The next generation network attached to the firepanel"},{"key":"assetNetwork2","networkType":"NGN2","nodeId":"12342","nodeType":"someType2","description":"The next generation network attached to the firepanel2"}]},{"asset":{"key":"tyco4100u","assetType":"FIREPANEL","generalConfigurationKey":"config","connectionKeys":["cell-connection","ethernet-connection"],"softwareKeys":["firmware-driver"],"sourceHierarchyLabelDescriptionKeys":["1","2","3"],"sourceKeys":["smoke1","smoke2","extender"],"interfaceControlKeys":["interface"],"assetNetworkKeys":["assetNetwork"]},"generalConfiguration":{"key":"config","serialNumber":"tyco","dateRetired":"2015-03-07T09:51:27-04:00 New_York","description":"fire panel configuration","timeZone":"PST","name":"name","dateProvisioned":"2015-03-07T09:51:27-04:00 New_York","modelType":"4100u","mac":"6d:46:08:8d:d8:58","customDetails":"{\"key\":\"value\"}","configurationVersion":"1.0","version":"1.0"},"connections":[{"key":"cell-connection","device1":"abcsd123454100u","device2":"cloud","networkKey":"network1"},{"key":"ethernet-connection","device1":"abcsd123454100u","device2":"cloud","networkKey":"network2"}],"networkIps":[{"key":"network1","ipAddress":"74.72.1.23","netmask":"255.255.255.0","networkType":"cellular"},{"key":"network2","ipAddress":"75.72.1.23","netmask":"255.255.255.0","networkType":"ethernet"}],"softwares":[{"key":"firmware-driver","name":"TycoSoft","checksum":"0123456789abcdef","description":"firepanel firmware driver","customDetails":"{\"key\":\"value\"}","target":"card 1","version":"1.0"}],"sourceHierarchyLabelDescriptions":[{"key":"1","description":"point","level":1},{"key":"2","description":"zone","level":2},{"key":"3","description":"sector","level":3}],"sources":[{"key":"smoke1","name":"Smoke detector 1","parentSourceKey":"extender","labelKeys":["label2"]},{"key":"smoke2","name":"Smoke detector 2","parentSourceKey":"extender","labelKeys":["label3","label4"]},{"key":"extender","name":"Smoke detector","childSourceKeys":["smoke1","smoke2"],"labelKeys":["label1"]}],"labels":[{"key":"label2","address":"M1-24","level":1,"description":"Smoke detector outside"},{"key":"label3","address":"E05","level":2,"description":"First floor hall"},{"key":"label4","address":"S003","level":3,"description":"West wing"},{"key":"label1","address":"M1-23","level":1,"description":"Smoke detector lobby"}],"interfaceControls":[{"key":"interface","name":"reset","customDetails":"{\"key\":\"value\"}","description":"reset a panel","type":"function"}],"assetNetworks":[{"key":"assetNetwork","networkType":"NGN","nodeId":"1234","nodeType":"someType","description":"The next generation network attached to the firepanel"}]},{"asset":{"key":"abcsd123454100u","assetType":"FIREPANEL","generalConfigurationKey":"config","connectionKeys":["cell-connection","ethernet-connection","ethernet-connection1","XXX"]},"generalConfiguration":{"key":"config","name":"name"},"connections":[{"key":"cell-connection","device1":"abcsd123454100u","device2":"cloud","networkKey":"network1"},{"key":"ethernet-connection","device1":"abcsd123454100u","device2":"cloud","networkKey":"network2"},{"key":"ethernet-connection1","device1":"abcsd123454100u","device2":"cloud","networkKey":"network3"},{"key":"XXX"}],"networkIps":[{"key":"network1","ipAddress":"74.72.1.23","netmask":"255.255.255.0","networkType":"cellular"},{"key":"network2","ipAddress":"75.72.1.23","netmask":"255.255.255.0","networkType":"ethernet"},{"key":"network3"}],"softwares":[],"sourceHierarchyLabelDescriptions":[],"interfaceControls":[],"assetNetworks":[]}]});
        });

        test('has a populated assets state', function() {
            assert.lengthOf(component.state.assets, 3);
        });

        test.skip('populates filteredAssets state based on the filter state', function() {
            var list = TestUtils.findRenderedDOMComponentWithTag(component, 'ul');
            TestUtils.Simulate.click(list.getDOMNode().children[1].children[0].children[0]);

            assert.lengthOf(component.state.filteredAssets, 1);
        });
    });

});