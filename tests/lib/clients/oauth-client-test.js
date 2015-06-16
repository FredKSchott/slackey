'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var SlackError = require('../../../lib/slack-error');

var SlackOAuthClient;
var slackOAuthClient;
var makeAPIRequestStub;

describe('SlackOAuthClient', function() {


  beforeEach(function() {
    makeAPIRequestStub = this.sinon.stub();
    SlackOAuthClient = proxyquire('../../../lib/clients/oauth-client.js', {
      '../make-api-request': makeAPIRequestStub
    });
    slackOAuthClient = new SlackOAuthClient({
      clientID: 'XXX',
      clientSecret: 'YYY'
    });
  });

  describe('constructor', function() {

    it('should return a SlackOAuthClient object when called', function() {
      assert.ok(slackOAuthClient instanceof SlackOAuthClient);
    });

    it('should set the correct options when called with options', function() {
      var createdSlackOAuthClient = new SlackOAuthClient({
        authRedirectURI: 'WWW',
        clientID: 'XXX',
        clientSecret: 'YYY',
        apiURL: 'ZZZ'
      });
      assert.equal(createdSlackOAuthClient.authRedirectURI, 'WWW');
      assert.equal(createdSlackOAuthClient.clientID, 'XXX');
      assert.equal(createdSlackOAuthClient.clientSecret, 'YYY');
      assert.equal(createdSlackOAuthClient.apiURL, 'ZZZ');
    });

    it('should throw an assertion error when called without a "clientID" option', function() {
      assert.throws(function() {
        new SlackOAuthClient({
          clientSecret: 'YYY'
        });
      }, assert.AssertionError);
    });

    it('should throw an assertion error when called without a "clientSecret" option', function() {
      assert.throws(function() {
        new SlackOAuthClient({
          clientID: 'XXX'
        });
      }, assert.AssertionError);
    });

    it('should default the API URL to "https://slack.com/api/" when called without the apiURL option', function() {
      var createdSlackOAuthClient = new SlackOAuthClient({
        authRedirectURI: 'WWW',
        clientID: 'XXX',
        clientSecret: 'YYY'
      });
      assert.equal(createdSlackOAuthClient.apiURL, 'https://slack.com/api/');
    });

  });

  describe('.SlackError', function() {

    it('is the custom error type SlackError', function() {
      assert.equal(slackOAuthClient.SlackError, SlackError);
    });

  });

  describe('.getToken()', function() {

    it('should POST to the oauth.access method with the correct form fields when called', function(done) {
      var createdSlackOAuthClient = new SlackOAuthClient({
        authRedirectURI: 'WWW',
        clientID: 'XXX',
        clientSecret: 'YYY'
      });
      makeAPIRequestStub.yields();

      createdSlackOAuthClient.getToken('AUTH_CODE', {redirectURI: 'REDIRECT_URL'}, function() {
        assert(makeAPIRequestStub.calledOnce);
        assert.deepEqual(makeAPIRequestStub.firstCall.args[0], {
          url: 'https://slack.com/api/oauth.access',
          method: 'POST',
          form: {
            redirect_uri: 'REDIRECT_URL',
            client_id: 'XXX',
            client_secret: 'YYY',
            code: 'AUTH_CODE'
          }
        });
        done();
      });
    });

    it('should use the default authRedirectURI when redirectURI option is not provided', function(done) {
      var createdSlackOAuthClient = new SlackOAuthClient({
        authRedirectURI: 'WWW',
        clientID: 'XXX',
        clientSecret: 'YYY'
      });
      makeAPIRequestStub.yields();

      createdSlackOAuthClient.getToken('AUTH_CODE', {}, function() {
        assert(makeAPIRequestStub.calledOnce);
        assert.deepEqual(makeAPIRequestStub.firstCall.args[0], {
          url: 'https://slack.com/api/oauth.access',
          method: 'POST',
          form: {
            redirect_uri: 'WWW',
            client_id: 'XXX',
            client_secret: 'YYY',
            code: 'AUTH_CODE'
          }
        });
        done();
      });
    });

    it('should create the URL from the apiURL property and the method argument when called', function() {
      var createdSlackOAuthClient = new SlackOAuthClient({
        clientID: 'XXX',
        clientSecret: 'YYY',
        apiURL: 'ZZZ'
      });
      createdSlackOAuthClient.getToken('AUTH_CODE');
      assert(makeAPIRequestStub.called);
      assert(makeAPIRequestStub.calledWithMatch({url: 'ZZZoauth.access'}));
    });

    it('should still call the provided callback when no options argument is provided', function(done) {
      makeAPIRequestStub.yields();
      slackOAuthClient.getToken('TEST_METHOD', done);
    });

  });

});
