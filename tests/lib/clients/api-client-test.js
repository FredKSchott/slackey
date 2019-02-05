'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var SlackError = require('../../../lib/slack-error');

var SlackAPIClient;
var slackAPIClient;
var makeAPIRequestStub;

describe('SlackAPIClient', function() {


  beforeEach(function() {
    makeAPIRequestStub = this.sinon.stub();
    SlackAPIClient = proxyquire('../../../lib/clients/api-client.js', {
      '../make-api-request': makeAPIRequestStub
    });
    slackAPIClient = new SlackAPIClient({
      token: 'XXX',
      apiURL: 'YYY'
    });
  });

  describe('constructor', function() {

    it('should return a SlackAPIClient object when called', function() {
      assert.ok(slackAPIClient instanceof SlackAPIClient);
    });

    it('should set the provided options when called with options', function() {
      var createdSlackAPIClient = new SlackAPIClient({
        token: 'XXX',
        apiURL: 'YYY'
      });
      assert.equal(createdSlackAPIClient.token, 'XXX');
      assert.equal(createdSlackAPIClient.apiURL, 'YYY');
    });

    it('should default the API URL to "https://slack.com/api/" when called without the apiURL option', function() {
      var createdSlackAPIClient = new SlackAPIClient({
        token: 'XXX'
      });
      assert.equal(createdSlackAPIClient.apiURL, 'https://slack.com/api/');
    });

  });

  describe('.SlackError', function() {

    it('is the custom error type SlackError', function() {
      assert.equal(slackAPIClient.SlackError, SlackError);
    });

  });

  describe('.send()', function() {

    it('should create the URL from the apiURL property and the method argument when called', function() {
      slackAPIClient.send('TEST_METHOD');
      assert(makeAPIRequestStub.called);
      assert(makeAPIRequestStub.calledWithMatch({url: 'YYYTEST_METHOD'}));
    });

    it('should still call the provided callback when no options argument is provided', function(done) {
      makeAPIRequestStub.yields();
      slackAPIClient.send('TEST_METHOD', done);
    });

    it('should always set the correct default request arguments when called', function() {
      slackAPIClient.send('TEST_METHOD');
      assert(makeAPIRequestStub.calledWithMatch({method: 'GET'}));
    });

    it('should append the token to the query string when called', function() {
      slackAPIClient.send('TEST_METHOD');
      assert(makeAPIRequestStub.calledWithMatch({qs: {token: 'XXX'}}));
    });

    it('should pass the provided options as query params via GET when called on a normal method', function() {
      var methodOptions = {foo: 'bar'};
      slackAPIClient.send('TEST_METHOD', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({qs: {foo: 'bar', token: 'XXX'}}));
    });

    it('should correctly strinfigy the request body when an array is provided to the "chat.postMessage" method', function() {
      var methodOptions = {attachments: [{text: 'foobar'}]};
      slackAPIClient.send('chat.postMessage', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'attachments=%5B%7B%22text%22%3A%22foobar%22%7D%5D&token=XXX'
      }));
    });

    it('should correctly strinfigy the request body when a string is provided to the "chat.postMessage" method', function() {
      var methodOptions = {attachments: '[{"text":"foobar"}]'};
      slackAPIClient.send('chat.postMessage', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'attachments=%5B%7B%22text%22%3A%22foobar%22%7D%5D&token=XXX'
      }));
    });

    it('should POST when called with "files.upload" method', function() {
      slackAPIClient.send('files.upload');
      assert(makeAPIRequestStub.calledWithMatch({method: 'POST'}));
    });

    it('should attach the file option as form-upload data when called with "file.upload" method', function() {
      var fileData = Buffer.from('123');
      var methodOptions = {file: fileData};
      slackAPIClient.send('files.upload', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({formData: {file: fileData}}));
    });

    it('should attach the content option as form body data when called with "file.upload" method', function() {
      var contentData = 'TEST_UPLOAD_CONTENT';
      var methodOptions = {content: contentData};
      slackAPIClient.send('files.upload', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({body: 'content=TEST_UPLOAD_CONTENT'}));
    });

  });

});
