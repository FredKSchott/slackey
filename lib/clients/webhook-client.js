'use strict';

////////////////////////////////////////////////////////////////////////////////
// Requirements
////////////////////////////////////////////////////////////////////////////////

var querystring = require('querystring');
var assert = require('assert');
var SlackError = require('../slack-error');
var makeWebhookRequest = require('../make-webhook-request');


////////////////////////////////////////////////////////////////////////////////
// Public
////////////////////////////////////////////////////////////////////////////////

/**
 * SlackWebhookClient - A client for working with a Slack Incoming Webhook URL. Each client is
 * created to work with a single webhook. These URLs require no authorization to send messages,
 * other than the URL itself.
 *
 * @constructor
 * @param {Object} options A collection of options to configure the client.
 * @param {string} options.webhookURL An Incoming Webhook URL to send messages to
 * @return {void}
 */
var SlackWebhookClient = module.exports = function SlackWebhookClient(options) {
  assert(options && options.webhookURL, 'SlackWebhookClient constructor requires the `webhookURL` option');
  this.webhookURL = options.webhookURL;
};

/** @type {SlackError} Attach the custom type to the SlackWebhookClient for consumer access */
SlackWebhookClient.prototype.SlackError = SlackError;

/**
 * Call an Incoming Webhook following Slack's webhook calling conventions.
 * See {@link https://api.slack.com/incoming-webhooks} for more information.
 *
 * @param {Object} payload The webhook payload, containing "text" and other arguments
 * @param {Function} [callback] An optional callback to propagate any errors/success to
 * @callback {[Error]} If an error occurs, it will be propagated to the client. If successful,
 *  the callback will be called (no success arguments since no valuable info is returned).
 */
SlackWebhookClient.prototype.send = function(payload, callback) {
  callback = callback || function () {/* no-op */};

  var requestOptions = {
    url: this.webhookURL,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: querystring.stringify({payload: JSON.stringify(payload)}).toString('utf8')
  };
  makeWebhookRequest(requestOptions, callback);
};
