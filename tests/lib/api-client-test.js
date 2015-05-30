'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var SlackError = require('../../lib/slack-error');

var SlackAPIClient;
var slackAPIClient;
var makeAPIRequestStub;

describe('SlackAPIClient', function() {


  beforeEach(function() {
    makeAPIRequestStub = this.sinon.stub();
    SlackAPIClient = proxyquire('../../lib/api-client.js', {
      './make-api-request': makeAPIRequestStub
    });
    slackAPIClient = new SlackAPIClient({
      token: 'XXX',
      apiURL: 'YYY',
    });
  });

  describe('constructor', function() {

    it('should return a SlackAPIClient object when called', function() {
      var createdSlackAPIClient = new SlackAPIClient();
      assert.ok(createdSlackAPIClient instanceof SlackAPIClient);
    });

    it('should set the provided options when called with options', function() {
      var createdSlackAPIClient = new SlackAPIClient({
        token: 'XXX',
        apiURL: 'YYY',
      });
      assert.equal(createdSlackAPIClient.token, 'XXX');
      assert.equal(createdSlackAPIClient.apiURL, 'YYY');
    });

  });

  describe('.SlackError', function() {

    it('is the custom error type SlackError', function() {
      assert.equal(slackAPIClient.SlackError, SlackError);
    });

  });

  describe('.api()', function() {

    it('should create the URL from the apiURL property and the method argument when called', function() {
      slackAPIClient.api('TEST_METHOD');
      assert(makeAPIRequestStub.called);
      assert(makeAPIRequestStub.calledWithMatch({url: 'YYYTEST_METHOD'}));
    });

    it('should still call the provided callback when no options argument is provided', function(done) {
      makeAPIRequestStub.yields();
      slackAPIClient.api('TEST_METHOD', done);
    });

    it('should always set the correct default request arguments when called', function() {
      slackAPIClient.api('TEST_METHOD');
      assert(makeAPIRequestStub.calledWithMatch({method: 'GET'}));
    });

    it('should append the token to the query string when called', function() {
      slackAPIClient.api('TEST_METHOD');
      assert(makeAPIRequestStub.calledWithMatch({qs: {token: 'XXX'}}));
    });

    it('should pass the provided options as query params via GET when called on a normal method', function() {
      var methodOptions = {foo: 'bar'};
      slackAPIClient.api('TEST_METHOD', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({qs: {foo: 'bar', token: 'XXX'}}));
    });

    it('should stringify the attachments argument when an array is provided to the "chat.postMessage" method', function() {
      var methodOptions = {attachments: [{text: 'foobar'}]};
      slackAPIClient.api('chat.postMessage', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({method: 'GET', qs: {attachments: '[{"text":"foobar"}]', token: 'XXX'}}));
    });

    it('should not modify the attachments argument when an string is provided to the "chat.postMessage" method', function() {
      var methodOptions = {attachments: '[{"text":"foobar"}]'};
      slackAPIClient.api('chat.postMessage', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({method: 'GET', qs: {attachments: '[{"text":"foobar"}]', token: 'XXX'}}));
    });

    it('should POST when called with "files.upload" method', function() {
      slackAPIClient.api('files.upload');
      assert(makeAPIRequestStub.calledWithMatch({method: 'POST'}));
    });

    it('should attach the file option as form-upload data when called with "file.upload" method', function() {
      var fileData = new Buffer(123);
      var methodOptions = {file: fileData};
      slackAPIClient.api('files.upload', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({formData: {file: fileData}}));
    });


    it('should attach the content option as form body data when called with "file.upload" method', function() {
      var contentData = 'TEST_UPLOAD_CONTENT';
      var methodOptions = {content: contentData};
      slackAPIClient.api('files.upload', methodOptions);
      assert(makeAPIRequestStub.calledWithMatch({body: {content: contentData}}));
    });

  });

});
