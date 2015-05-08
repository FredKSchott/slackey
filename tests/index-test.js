'use strict';

var assert = require('assert');
var SlackAPI = require('../index.js');
var SlackAPIClient = require('../lib/api-client.js');

describe('SlackAPI', function() {

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

  describe('.getClient()', function() {

    var slackAPI;

    beforeEach(function() {
      slackAPI = new SlackAPI();
    });

    it('should return a SlackAPIClient object when called', function() {
      var slackAPIClient = slackAPI.getClient('TOKEN');
      assert.ok(slackAPIClient instanceof SlackAPIClient);
    });

    it.skip('should pass the token to the SlackAPIClient constructor when called', function() {
      // TODO: Implement when mocking support is added
    });

  });

  describe('.getAccessToken()', function() {

    it('should throw an assertion error when clientID has not been set', function() {
      var slackAPI = new SlackAPI({clientSecret: 'XXX'});
      assert.throws(function() {
        slackAPI.getAccessToken({code: 'AUTHCODE'});
      }, assert.AssertionError);
    });

    it('should throw an assertion error when clientSecret has not been set', function() {
      var slackAPI = new SlackAPI({clientID: 'XXX'});
      assert.throws(function() {
        slackAPI.getAccessToken({code: 'AUTHCODE'});
      }, assert.AssertionError);
    });

    it.skip('should POST to the oauth.access method with the correct form fields when called', function() {
      // TODO: Implement when mocking support is added
    });

    it.skip('should use the default authRedirectURI when redirectURI option is not provided', function() {
      // TODO: Implement when mocking support is added
    });

  });

});
