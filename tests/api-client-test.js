'use strict';

var assert = require('assert');
var SlackAPIClient = require('../lib/api-client.js');

describe('SlackAPIClient', function() {

  describe('constructor', function() {

    it('should return a SlackAPIClient object when called', function() {
      var slackAPIClient = new SlackAPIClient();
      assert.ok(slackAPIClient instanceof SlackAPIClient);
    });

    it('should set the provided options when called with options', function() {
      var slackAPIClient = new SlackAPIClient({
        token: 'XXX',
        apiURL: 'YYY',
      });
      assert.equal(slackAPIClient.token, 'XXX');
      assert.equal(slackAPIClient.apiURL, 'YYY');
    });

  });

  describe('.makeRequest()', function() {

    it.skip('should pass options argument to the request function when called', function() {
      // TODO: Implement when mocking support is added
    });

    it.skip('should propagate any request error to the callback', function() {
      // TODO: Implement when mocking support is added
    });

    it.skip('should return the response body and response object to the callback in that order', function() {
      // TODO: Implement when mocking support is added
    });

  });

  describe('.api()', function() {

    it.skip('should create the URL from the apiURL property and the method argument when called', function() {
      // TODO: Implement when mocking support is added
    });

    it.skip('should append the token to the query string when called', function() {
      // TODO: Implement when mocking support is added
    });

    it.skip('should pass the provided options as query params via GET when called on a normal method', function() {
      // TODO: Implement when mocking support is added
    });

    it.skip('should POST when called with "file.upload" method', function() {
      // TODO: Implement when mocking support is added
    });

    it.skip('should attach the file option as form-upload data when called with "file.upload" method', function() {
      // TODO: Implement when mocking support is added
    });

    it.skip('should attach the content option as form body data when called with "file.upload" method', function() {
      // TODO: Implement when mocking support is added
    });

    it.skip('should handle the callback when called without an options argument', function() {
      // TODO: Implement when mocking support is added
    });

  });

});
