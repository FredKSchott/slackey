'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var SlackError = require('../../src/slack-error');

var makeAPIRequest;
var requestStub;

describe('makeAPIRequest', function() {

  beforeEach(function() {
    requestStub = this.sinon.stub();
    makeAPIRequest = proxyquire('../../src/make-api-request', {
      'request': requestStub
    });
  });

  var requestOptions;

  beforeEach(function() {
    requestOptions = {
      url: 'https://slack.com/api/TEST',
      foo: 'bar'
    };
  });

  it('should pass options argument to the request function when called', function() {
    makeAPIRequest(requestOptions);
    assert(requestStub.called);
    assert(requestStub.calledWith(requestOptions));
  });

  it('should set the `json` request option if it has not been set when called', function() {
    makeAPIRequest(requestOptions);
    assert(requestStub.calledWithMatch({json: true}));
  });

  it('should not set the `json` request option if it has already been set when called', function() {
    requestOptions.json = false;
    makeAPIRequest(requestOptions);
    assert(requestStub.calledWithMatch({json: false}));
  });

  it('should return the response body (without ok property) to the callback when the response is successfully returned', function(done) {
    var responseBody = {ok: true, user_id: 'foobar'};
    var expectedResponseBody = {user_id: 'foobar'};
    var responseObj = {response: true, body: responseBody};
    requestStub.yields(null, responseObj);
    makeAPIRequest(requestOptions, function(err, response) {
      assert.equal(err, null);
      assert.deepEqual(response, expectedResponseBody);
      done();
    });
  });

  it('should propagate any request error to the callback when one occurs', function(done) {
    var requestError = new Error('[TEST] request() error');
    requestStub.yields(requestError);
    makeAPIRequest(requestOptions, function(err, response) {
      assert.equal(err, requestError);
      assert.equal(response, undefined);
      done();
    });
  });

  it('should propagate a SlackError object with error request/response information when the Slack response is bad', function(done) {
    var responseBody = {ok: false, error: 'some_error_string'};
    var responseObj = {request: {href: requestOptions.url}, body: responseBody};
    requestStub.yields(null, responseObj);
    makeAPIRequest(requestOptions, function(err, response) {
      assert(err instanceof SlackError);
      assert.equal(err.message, responseBody.error);
      assert.equal(err.requestURL, requestOptions.url);
      assert.equal(err.responseBody, responseBody);
      done();
    });
  });

});
