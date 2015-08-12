var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var AssetList = require('../../../../src/client/components/dashboard/asset-list');

suite('Asset list component', function() {

    var stub = require('../../stub-router-context');

    suite('with assets', function() {

        var wrapper, component, table, row, routerSpy;
        suiteSetup(function() {

            var assets = [
                {
                    "asset": {
                        "key": "tyco4100u",
                        "assetType": "FIREPANEL",
                        "generalConfigurationKey": "config",
                        "connectionKeys": ["cell-connection", "ethernet-connection"],
                        "softwareKeys": ["firmware-driver"],
                        "sourceHierarchyLabelDescriptionKeys": ["1", "2", "3"],
                        "sourceKeys": ["smoke1", "smoke2", "extender"],
                        "interfaceControlKeys": ["interface"],
                        "assetNetworkKeys": ["assetNetwork"]
                    },
                    "generalConfiguration": {
                        "key": "config",
                        "serialNumber": "12345",
                        "dateRetired": "2015-03-07T09:51:27-04:00 New_York",
                        "description": "fire panel configuration",
                        "timeZone": "PST",
                        "name": "device",
                        "dateProvisioned": "2015-03-07T09:51:27-04:00 New_York",
                        "modelType": "4100u",
                        "mac": "6d:46:08:8d:d8:58",
                        "customDetails": "{\"key\":\"value\"}",
                        "configurationVersion": "1.0",
                        "version": "1 .0"
                    },
                    "connections":[
                        { "key":"cell-connection","device1":"abcsd123454100u","device2":"cloud","networkKey": "network1"},
                        { "key": "ethernet-connection", "device1": "abcsd123454100u", "device2": "cloud", "networkKey": "network2" }
                    ],
                    "networkIps": [
                        { "key": "network1", "ipAddress": "74.72.1.23", "netmask": "255.255.255.0", "networkType": "cellular"},
                        { "key": "network2", "ipAddress": "75.72.1.23", "netmask": "255.255.255.0", "networkType": "ethernet"}
                    ],
                    "softwares": [
                        { "key": "firmware-driver", "name": "TycoSoft", "checksum": "0123456789abcdef", "description": "firepanel firmware driver", "customDetails": "{\"key\":\"value\"}", "target": "card 1", "version": "1.0"}
                    ],
                    "sourceHierarchyLabelDescriptions": [
                        { "key": "1", "description": "point", "level": 1},
                        { "key": "2", "description": "zone", "level": 2},
                        { "key": "3", "description": "sector", "level": 3}
                    ],
                    "sources": [
                        { "key": "smoke1", "name": "Smoke detector 1", "parentSourceKey": "extender", "labelKeys": ["label2"] },
                        { "key": "smoke2", "name": "Smoke detector 2", "parentSourceKey": "extender", "labelKeys": ["label3", "label4"]},
                        { "key": "extender", "name": "Smoke detector", "childSourceKeys": ["smoke1", "smoke2"], "labelKeys": ["label1"]}
                    ],
                    "labels": [
                        { "key": "label2", "address": "M1-24", "level": 1, "description": "Smoke detector outside" },
                        { "key": "label3", "address": "E05", "level": 2, "description": "First floor hall" },
                        { "key": "label4", "address": "S003", "level": 3, "description": "West wing"},
                        { "key": "label1", "address": "M1-23", "level": 1, "description": "Smoke detector lobby" }
                    ],
                    "interfaceControls": [
                        { "key": "interface", "name": "reset", "customDetails": "{\"key\":\"value\"}", "description": "reset a panel", "type": "function"}
                    ],
                    "assetNetworks": [
                        {  "key": "assetNetwork", "networkType": "NGN", "nodeId": "1234", "nodeType": "someType", "description": "The next generation network attached to the firepanel"}
                    ]
                }
            ];

            var AssetListWrapper = stub(AssetList, {
                ref: 'assetList',
                assets: assets
            });

            //create wrapper
            wrapper = TestUtils.renderIntoDocument(
                <AssetListWrapper />
            );

            //component
            component = wrapper.refs.assetList;

            //elements
            table = TestUtils.findRenderedDOMComponentWithTag(wrapper, 'table');
            row = table.getDOMNode().children[1].children[0];
        });

        setup(function() {
            routerSpy = sinon.spy(wrapper.getChildContext().router, 'transitionTo');
        });

        teardown(function() {
            routerSpy.restore();
        });

        test('is passed a collection of assets', function() {
            assert.isArray(component.props.assets);
            assert.lengthOf(component.props.assets, 1);
        });

        test('renders a table representation of assets', function() {
            assert.equal(table.getDOMNode().tagName, 'TABLE');
        });

        test('renders the appropriate asset properties', function() {
            assert.equal(row.children[0].innerText, 'device');
            assert.equal(row.children[1].innerText, '12345');
            assert.equal(row.children[2].innerText, 'FIREPANEL');
            assert.equal(row.children[3].innerText, '4100u');
            assert.equal(row.children[4].innerText, '2015-03-07T09:51:27-04:00 New_York');
            assert.include(row.children[5].children[0].children[0].getAttribute('class'), 'glyphicon-cell');
        });

        test('links each asset row to the appropriate asset overview section', function(done) {
            TestUtils.Simulate.click(row);

            setTimeout(function() {
                assert.isTrue(routerSpy.calledOnce);
                assert.isTrue(routerSpy.calledWith('asset', {
                    assetId: 'tyco4100u'
                }));

                done();
            }, 1);
        });
    });

    suite('without data', function() {

        var component, table;
        setup(function() {
            component = TestUtils.renderIntoDocument(
                <AssetList  />
            )

            table = TestUtils.findRenderedDOMComponentWithTag(component, 'table');
        });

        test('renders a single row when there are no assets', function() {
            var row = table.getDOMNode().children[1].children[0];

            assert.equal(row.tagName, 'TR');
            assert.equal(row.children[0].innerText, 'No records match the selected filters.')
        });
    });
});