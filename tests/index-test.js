'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var SlackAPIClient = require('../lib/api-client');
var SlackError = require('../lib/slack-error');

var SlackAPI;
var SlackAPIClientSpy;
var makeAPIRequestStub;

describe('SlackAPI', function() {

  beforeEach(function() {
    makeAPIRequestStub = this.sinon.stub();
    SlackAPIClientSpy = this.sinon.spy(SlackAPIClient);
    SlackAPI = proxyquire('../index.js', {
      './lib/api-client': SlackAPIClientSpy,
      './lib/make-api-request': makeAPIRequestStub
    });
  });

  describe('constructor', function() {

    it('should return a SlackAPI object when called', function() {
      var slackAPI = new SlackAPI();
      assert.ok(slackAPI instanceof SlackAPI);
    });

    it('should set the provided options when called with options', function() {
      var slackAPI = new SlackAPI({
        clientID: 'WWW',
        clientSecret: 'XXX',
        apiURL: 'YYY',
        authRedirectURI: 'ZZZ',
      });
      assert.equal(slackAPI.clientID, 'WWW');
      assert.equal(slackAPI.clientSecret, 'XXX');
      assert.equal(slackAPI.apiURL, 'YYY');
      assert.equal(slackAPI.authRedirectURI, 'ZZZ');
    });

    it('should set the default apiURL when called without that option', function() {
      var slackAPI = new SlackAPI({
        clientID: 'WWW',
        clientSecret: 'XXX'
      });
      assert.equal(slackAPI.apiURL, 'https://slack.com/api/');
    });

  });

  describe('.SlackError', function() {

    it('is the custom error type SlackError', function() {
      var slackAPI = new SlackAPI();
      assert.equal(slackAPI.SlackError, SlackError);
    });

  });

  describe('.getClient()', function() {

    it('should return a SlackAPIClient object when called', function() {
      var slackAPI = new SlackAPI();
      var slackAPIClient = slackAPI.getClient('TOKEN');
      assert.ok(slackAPIClient instanceof SlackAPIClient);
    });

    it('should pass the token and API URL to the SlackAPIClient constructor when called', function() {
      var slackAPI = new SlackAPI({apiURL: 'SLACK_API_URL'});
      slackAPI.getClient('TOKEN');
      assert(SlackAPIClientSpy.calledWithNew());
      assert(SlackAPIClientSpy.calledWith({token: 'TOKEN', apiURL: 'SLACK_API_URL'}));
    });

  });

  describe('.getAccessToken()', function() {

    it('should throw an assertion error when clientID has not been set', function() {
      var slackAPI = new SlackAPI({clientSecret: 'XXX'});
      assert.throws(function() {
        slackAPI.getAccessToken({code: 'AUTH_CODE'});
      }, assert.AssertionError);
    });

    it('should throw an assertion error when clientSecret has not been set', function() {
      var slackAPI = new SlackAPI({clientID: 'XXX'});
      assert.throws(function() {
        slackAPI.getAccessToken({code: 'AUTH_CODE'});
      }, assert.AssertionError);
    });

    it('should POST to the oauth.access method with the correct form fields when called', function(done) {
      var slackAPI = new SlackAPI({clientID: 'XXX', clientSecret: 'YYY', authRedirectURI: 'ZZZ'});
      makeAPIRequestStub.yields();

      slackAPI.getAccessToken({code: 'AUTH_CODE', redirectURI: 'REDIRECT_URL'}, function() {
        assert(makeAPIRequestStub.calledOnce);
        assert.deepEqual(makeAPIRequestStub.firstCall.args[0], {
          url: 'https://slack.com/api/oauth.access',
          method: 'POST',
          form: {
            client_id: 'XXX',
            client_secret: 'YYY',
            code: 'AUTH_CODE',
            redirect_uri: 'REDIRECT_URL'
          }
        });
        done();
      });
    });

    it('should use the default authRedirectURI when redirectURI option is not provided', function(done) {
      var slackAPI = new SlackAPI({clientID: 'XXX', clientSecret: 'YYY', authRedirectURI: 'ZZZ'});
      makeAPIRequestStub.yields();

      slackAPI.getAccessToken({code: 'AUTH_CODE'}, function() {
        assert(makeAPIRequestStub.calledOnce);
        assert.deepEqual(makeAPIRequestStub.firstCall.args[0], {
          url: 'https://slack.com/api/oauth.access',
          method: 'POST',
          form: {
            client_id: 'XXX',
            client_secret: 'YYY',
            code: 'AUTH_CODE',
            redirect_uri: 'ZZZ'
          }
        });
        done();
      });
    });

  });

});
