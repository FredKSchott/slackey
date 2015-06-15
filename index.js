'use strict';

////////////////////////////////////////////////////////////////////////////////
// Requirements
////////////////////////////////////////////////////////////////////////////////

var assert = require('assert');
var SlackAPIClient = require('./lib/api-client');
var SlackWebhookClient = require('./lib/webhook-client');
var SlackError = require('./lib/slack-error');
var makeAPIRequest = require('./lib/make-api-request');


////////////////////////////////////////////////////////////////////////////////
// SlackAPI
////////////////////////////////////////////////////////////////////////////////

/**
 * SlackAPI (aka Slackey) - A library for working with the Slack API. SlackAPI can
 * interact with the API directly, or on behalf of a user via a SlackAPIClient.
 *
 * @param {Object} config A collection of options to configure SlackAPI with.
 * @param {Object} [config.clientID] Your application's "client ID", required for working with auth codes
 * @param {Object} [config.clientSecret] Your application's "client Secret", required for working with auth codes
 * @param {Object} [config.authRedirectURI] The default redirect URL your application uses during OAuth authentication
 * @param {Object} [config.apiURL] The API URL to communicate with, defaults to 'https://slack.com/api/'
 * @return {void}
 */
var SlackAPI = module.exports = function SlackAPI(config) {
  config = config || {};
  this.clientID = config.clientID;
  this.clientSecret = config.clientSecret;
  this.apiURL = config.apiURL || 'https://slack.com/api/';
  this.authRedirectURI = config.authRedirectURI;
};

/** @type {SlackError} Attach the custom type to the SlackAPI for consumer access */
SlackAPI.prototype.SlackError = SlackError;

/**
 * Return a newly initialized API client with the provided access token. You can use this client to interact
 * with any API method on behalf of the user.
 *
 * @param  {string} token
 * @return {SlackAPIClient}
 */
SlackAPI.prototype.getAPIClient = function(token) {
  return new SlackAPIClient({
    token: token,
    apiURL: this.apiURL,
  });
};

/**
 * Return a newly initialized Webhook client with the provided webhook URL. You can use this client to
 * send requests to the Incoming Webhook provided.
 *
 * @param  {string} webhookURL
 * @return {SlackWebhookClient}
 */
SlackAPI.prototype.getWebhookClient = function(webhookURL) {
  return new SlackWebhookClient({
    webhookURL: webhookURL,
  });
};


/**
 * Call the 'oauth.access' API method to exchange a fresh auth code for an authorized API access token.
 * You can use this token to generate a new SlackAPIClient via `.getClient()` and make calls on behalf
 * of the user.
 *
 * @param {Object} options
 * @param {string} options.code
 * @param {string} [options.redirectURI] This must match the originally submitted URI (if one was sent).
 *                                       Defaults to the 'authRedirectURI' option passed to the SlackAPI
 *                                       constructor, if one was provided.
 * @param {Function} callback
 * @throws {AssertionError} If clientID or clientSecret was not set on initialization.
 * @callback {[Error, ResponseBody, Response]}
 */
SlackAPI.prototype.getAccessToken = function(options, callback) {
  assert(this.clientID, 'a clientID is required to authorize users with the Slack API.');
  assert(this.clientSecret, 'a clientSecret is required to authorize users with the Slack API.');
  var redirectURI = options.redirectURI || this.authRedirectURI;
  var requestOptions = {
    url: this.apiURL + 'oauth.access',
    method: 'POST',
    form: {
      client_id: this.clientID,
      client_secret: this.clientSecret,
      code: options.code,
      redirect_uri: redirectURI,
    }
  };
  makeAPIRequest(requestOptions, callback);
};

