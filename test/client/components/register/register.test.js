var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var Register = require('../../../../src/client/components/register/register');

suite('Register page', function() {

    var component, server;
    suiteSetup(function() {

        //xhr
        server = sinon.fakeServer.create();
        server.respondImmediately = true;

        //static XHR responses
        server.respondWith('GET', '/services/data/locales', [200, {}, '[{"name":"English (United States)","code":"en-US"},{"name":"English","code":"en"},{"name":"German","code":"de"},{"name":"Spanish (Mexico)","code":"es-MX"},{"name":"Spanish (Spain)","code":"es-ES"},{"name":"Spanish(Chile)","code":"es-CL"},{"name":"Japanese","code":"ja-JP"}]']);
        server.respondWith('GET', '/services/data/locale', [200, {}, '{"locale":"es-MX"}']);

        component = TestUtils.renderIntoDocument(
            <Register />
        );
    });

    suiteTeardown(function() {
        server.requests = [];
        server.restore();
    });

    test('has a root React element', function() {
        assert.isTrue(TestUtils.isCompositeComponent(component));
    });

    suite('Create user form', function() {

        var form, submit, locale;

        suiteSetup(function() {

            //elements
            form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
            submit = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button')[1];
            locale = TestUtils.scryRenderedDOMComponentsWithTag(component, 'button')[0];

            //reset server requests
            server.requests = [];
        });

        setup(function() {

        });

        teardown(function() {
            server.requests = [];
        });

        test('disables submit button on form submit', function(done) {

            TestUtils.Simulate.submit(form);

            setTimeout(function() {

                assert.isTrue(submit.getDOMNode().disabled);

                done();
            }, 1);
        });

        test('clears all input fields on a successful submit', function(done) {

            TestUtils.Simulate.submit(form);

            setTimeout(function() {

                assert.equal(component.refs.firstName.getDOMNode().value, '');
                assert.equal(component.refs.lastName.getDOMNode().value, '');
                assert.equal(component.refs.email.getDOMNode().value, '');
                assert.equal(component.refs.password.getDOMNode().value, '');

                done();
            }, 1);
        });

        test('makes a POST request to the user service on form submit', function(done) {

            TestUtils.Simulate.submit(form);

            setTimeout(function() {
                assert.equal(server.requests.length, 1);
                assert.equal(server.requests[0].url, '/services/user');
                done();
            }, 1);
        });

        test('has a localization select menu', function() {
            assert.isTrue(TestUtils.isDOMComponent(locale));
        });

        suite('with a localization select menu', function() {

            test('has a default selected localization', function() {
                assert.equal(locale.getDOMNode().innerText, 'English (United States)');
            });
        });
    });

});