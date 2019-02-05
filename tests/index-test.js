

import assert from 'assert';
import proxyquire from 'proxyquire';
import {SlackAPIClient} from '../src/clients/api-client';
import {SlackWebhookClient} from '../src/clients/webhook-client';
import {SlackOAuthClient} from '../src/clients/oauth-client';
import {SlackError}from '../src/slack-error';

var slackey;
var SlackAPIClientSpy;
var SlackWebhookClientSpy;
var SlackOAuthClientSpy;

describe('Slackey', function() {

  beforeEach(function() {
    SlackAPIClientSpy = this.sinon.spy(SlackAPIClient);
    SlackWebhookClientSpy = this.sinon.spy(SlackWebhookClient);
    SlackOAuthClientSpy = this.sinon.spy(SlackOAuthClient);
    slackey = proxyquire('../src/index.js', {
      './clients/api-client': {SlackAPIClient: SlackAPIClientSpy},
      './clients/webhook-client': {SlackWebhookClient: SlackWebhookClientSpy},
      './clients/oauth-client': {SlackOAuthClient: SlackOAuthClientSpy}
    });
  });

  describe('.SlackError', function() {

    it('is the custom error type SlackError', function() {
      assert.equal(slackey.SlackError, SlackError);
    });

  });

  describe('.getAPIClient()', function() {

    it('should return a SlackAPIClient object when called', function() {
      var slackAPIClient = slackey.getAPIClient('ACCESS_TOKEN');
      assert.ok(slackAPIClient instanceof SlackAPIClient);
    });

    it('should pass the token to the SlackOAuthClient constructor when called with a string', function() {
      slackey.getAPIClient('ACCESS_TOKEN');
      assert(SlackAPIClientSpy.calledWithNew());
      assert(SlackAPIClientSpy.calledWith({token: 'ACCESS_TOKEN'}));
    });

    it('should pass the configuration options to the SlackOAuthClient constructor when called with an object', function() {
      slackey.getAPIClient({token: 'ACCESS_TOKEN', apiURL: 'SLACK_API_URL'});
      assert(SlackAPIClientSpy.calledWithNew());
      assert(SlackAPIClientSpy.calledWith({token: 'ACCESS_TOKEN', apiURL: 'SLACK_API_URL'}));
    });

    it('should throw an assertion error when called without a "token" option', function() {
      assert.throws(function() {
        slackey.getAPIClient({apiURL: 'SLACK_API_URL'});
      }, assert.AssertionError);
    });

  });

  describe('.getWebhookClient()', function() {

    it('should return a SlackWebhookClient object when called', function() {
      var slackWebhookClient = slackey.getWebhookClient('WEBHOOK_URL');
      assert.ok(slackWebhookClient instanceof SlackWebhookClient);
    });

    it('should pass the token to the SlackWebhookClient constructor when called', function() {
      slackey.getWebhookClient('WEBHOOK_URL');
      assert(SlackWebhookClientSpy.calledWithNew());
      assert(SlackWebhookClientSpy.calledWith({webhookURL: 'WEBHOOK_URL'}));
    });

  });

  describe('.getOAuthClient()', function() {

    it('should throw an assertion error when called without a "clientID" option', function() {
      assert.throws(function() {
        slackey.getOAuthClient({clientSecret: 'YYY'});
      }, assert.AssertionError);
    });

    it('should throw an assertion error when called without a "clientSecret" option', function() {
      assert.throws(function() {
        slackey.getOAuthClient({clientID: 'XXX'});
      }, assert.AssertionError);
    });

    it('should return a SlackOAuthClient object when called with the correct options', function() {
      var slackWebhookClient = slackey.getOAuthClient({
        clientID: 'XXX',
        clientSecret: 'YYY'
      });
      assert.ok(slackWebhookClient instanceof SlackOAuthClient);
    });

  });

});
