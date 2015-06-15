'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var SlackError = require('../../lib/slack-error');

var SlackWebhookClient;
var slackWebhookClient;
var makeWebhookRequestStub;

describe('SlackWebhookClient', function() {


  beforeEach(function() {
    makeWebhookRequestStub = this.sinon.stub();
    SlackWebhookClient = proxyquire('../../lib/webhook-client.js', {
      './make-webhook-request': makeWebhookRequestStub
    });
    slackWebhookClient = new SlackWebhookClient({
      webhookURL: 'XXX',
    });
  });

  describe('constructor', function() {

    it('should throw an assertion error when called without options', function() {
      assert.throws(function() {
        new SlackWebhookClient();
      });
    });

    it('should throw an assertion error when called without the webhookURL option', function() {
      assert.throws(function() {
        new SlackWebhookClient({foo: 'bar'});
      });
    });

    it('should set the provided options when called with options', function() {
      var createdSlackWebhookClient = new SlackWebhookClient({
        webhookURL: 'XXX',
      });
      assert.ok(createdSlackWebhookClient instanceof SlackWebhookClient);
      assert.equal(createdSlackWebhookClient.webhookURL, 'XXX');
    });

  });

  describe('.SlackError', function() {

    it('is the custom error type SlackError', function() {
      assert.equal(slackWebhookClient.SlackError, SlackError);
    });

  });

  describe('.send()', function() {

    it('should create the URL from the webhookURL property when called', function() {
      slackWebhookClient.send();
      assert(makeWebhookRequestStub.called);
      assert(makeWebhookRequestStub.calledWithMatch({url: 'XXX'}));
    });

    it('should always set the correct default request arguments when called', function() {
      slackWebhookClient.send();
      assert(makeWebhookRequestStub.calledWithMatch({
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }));
    });

    it('should send the payload as an url-encoded JSON string when called', function() {
      var simplePayload = {text: 'Hello World!'};
      slackWebhookClient.send(simplePayload);
      assert(makeWebhookRequestStub.calledWithMatch({body: 'payload=%7B%22text%22%3A%22Hello%20World!%22%7D'}));
    });

    it('should send a complex payload as an url-encoded JSON string when called', function() {
      var complexPayload = {
        channel: '#general',
        username: 'webhookbot',
        text: 'This is posted to #general and comes from a bot named webhookbot.',
        icon_emoji: ':ghost:'
      };
      slackWebhookClient.send(complexPayload);
      assert(makeWebhookRequestStub.calledWithMatch({body: 'payload=%7B%22channel%22%3A%22%23general%22%2C%22username%22%3A%22webhookbot%22%2C%22text%22%3A%22This%20is%20posted%20to%20%23general%20and%20comes%20from%20a%20bot%20named%20webhookbot.%22%2C%22icon_emoji%22%3A%22%3Aghost%3A%22%7D'}));
    });


  });

});
