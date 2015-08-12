var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var Login = require('../../../../src/client/components/login/login')

suite('Login page', function() {

    var stub = require('../../stub-router-context');

    var wrapper, component, server;
    suiteSetup(function() {

        //mock login
        var LoginWrapper = stub(Login, {
            ref: 'login'
        }, {
            getCurrentPath: function() {
                return '/login';
            }
        });

        //create wrapper
        wrapper = TestUtils.renderIntoDocument(
            <LoginWrapper />
        );

        //get component
        component = wrapper.refs.login;

        //xhr
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
    });

    suiteTeardown(function() {
        server.requests = [];
        server.restore();
    });

    suite('Login component', function() {

        var form, routerSpy;
        setup(function() {
            //elements
            form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');

            //spy
            routerSpy = sinon.spy(wrapper.getChildContext().router, 'transitionTo');

            //reset server requests
            server.requests = [];
        });

        teardown(function() {
            routerSpy.restore();
        });

        test('has a logged out user', function() {
            assert.isDefined(component.state.user);
            assert.isDefined(component.state.user.email);
            assert.isDefined(component.state.user.password);
        });

        test('tracks the submit status of the login form', function() {
            assert.isDefined(component.state.isSubmitting);
        });

        test('makes a POST request to the session service on form submit', function(done) {

            TestUtils.Simulate.submit(form);

            setTimeout(function() {

                assert.equal(server.requests.length, 2);
                assert.equal(server.requests[0].url, '/services/data/assets');
                assert.equal(server.requests[1].url, '/services/session');

                done();
            }, 50);
        });

        test('transitions to the dashboard when a 200 status is returned', function(done) {

            server.respondWith('POST', '/services/session', [200, {}, '']);

            TestUtils.Simulate.submit(form);

            setTimeout(function() {
                assert.isTrue(routerSpy.calledOnce);
                assert.isTrue(routerSpy.calledWith('dashboard'));

                done();
            }, 30);
        });

        test('transitions to the 2fa challenge page when a 403 status is returned', function(done) {

            server.respondWith('POST', '/services/session', [403, {}, '']);

            TestUtils.Simulate.submit(form);

            setTimeout(function() {
                assert.isTrue(routerSpy.calledOnce);
                assert.isTrue(routerSpy.calledWith('challenge'));

                done();
            }, 30);
        });
    });

    suite('challenge form', function() {

        var AuthActions = require('../../../../src/client/actions/authentication');
        var authSpy;
        var form, code;

        suiteSetup(function() {

            //mock login
            var LoginWrapper = stub(Login, {
                ref: 'login'
            }, {
                getCurrentPath: function() {
                    return '/challenge';
                }
            });

            //create wrapper
            wrapper = TestUtils.renderIntoDocument(
                <LoginWrapper />
            );

            //get component
            component = wrapper.refs.login;

            //elements
            form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
            code = TestUtils.findRenderedDOMComponentWithTag(component, 'input');

            //server
            server.requests = [];
        });

        setup(function() {
            //spy
            authSpy = sinon.spy(AuthActions, 'authenticate');
        });

        teardown(function() {
            server.requests = [];
            authSpy.restore();
        });

        test('makes a POST request to the session service on submit', function(done) {

            server.respondWith('POST', '/services/session', [200, {}, '']);

            TestUtils.Simulate.submit(form);

            setTimeout(function() {
                assert.equal(server.requests.length, 1);
                assert.equal(server.requests[0].url, '/services/session');

                done();
            }, 50);
        });

        test('calls the authentication service with a username, password, authCode on submit', function(done) {

            //fake the username / password form
            component.state.user.email = 'test@example.com';
            component.state.user.password = 'password';
            component.refs.authCode.getDOMNode().value = '123456';//simulate does not work

            server.respondWith('POST', '/services/session', [403, {}, '']);

            TestUtils.Simulate.submit(form.getDOMNode());

            setTimeout(function() {

                assert.isTrue(authSpy.calledOnce);
                assert.equal(authSpy.getCall(0).args[0].email, 'test@example.com');
                assert.equal(authSpy.getCall(0).args[0].password, 'password');
                assert.equal(authSpy.getCall(0).args[0].authCode, '123456');

                done();
            }, 100);
        });
    });
});