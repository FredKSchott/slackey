'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var SlackError = require('../../lib/slack-error');

var makeWebhookRequest;
var requestStub;

describe('makeWebhookRequest', function() {

  beforeEach(function() {
    requestStub = this.sinon.stub();
    makeWebhookRequest = proxyquire('../../lib/make-webhook-request', {
      'request': requestStub
    });
  });

  var requestOptions;

  beforeEach(function() {
    requestOptions = {
      url: 'https://SOME.WEBHOOK.URL',
      foo: 'bar'
    };
  });

  it('should pass options argument to the request function when called', function() {
    makeWebhookRequest(requestOptions);
    assert(requestStub.called);
    assert(requestStub.calledWith(requestOptions));
  });

  it('should return no success argument to the callback when the response is successfully returned', function(done) {
    var responseBody = 'ok';
    var responseObj = {response: true, body: responseBody};
    requestStub.yields(null, responseObj);
    makeWebhookRequest(requestOptions, function(err, response) {
      assert.equal(err, null);
      assert.equal(response, undefined);
      done();
    });
  });

  it('should propagate any request error to the callback when one occurs', function(done) {
    var requestError = new Error('[TEST] request() error');
    requestStub.yields(requestError);
    makeWebhookRequest(requestOptions, function(err, response) {
      assert.equal(err, requestError);
      assert.equal(response, undefined);
      done();
    });
  });

  it('should propagate a SlackError object with error request/response information when the Slack response is bad', function(done) {
    var responseBody = 'Payload was not valid JSON';
    var responseObj = {request: {href: requestOptions.url}, body: responseBody};
    requestStub.yields(null, responseObj);
    makeWebhookRequest(requestOptions, function(err, response) {
      assert(err instanceof SlackError);
      assert.equal(err.message, responseBody);
      assert.equal(err.requestURL, requestOptions.url);
      assert.equal(err.responseBody, responseBody);
      done();
    });
  });

});
