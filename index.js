'use strict';

////////////////////////////////////////////////////////////////////////////////
// Requirements
////////////////////////////////////////////////////////////////////////////////

var SlackAPIClient = require('./lib/clients/api-client');
var SlackOAuthClient = require('./lib/clients/oauth-client');
var SlackWebhookClient = require('./lib/clients/webhook-client');
var SlackError = require('./lib/slack-error');


////////////////////////////////////////////////////////////////////////////////
// Slackey
////////////////////////////////////////////////////////////////////////////////

/**
 * Slackey - A library for working with the Slack API. Slackey can interact with the
 * API via webhooks, or on behalf of a user via API & OAuth clients. See the `/clients`
 * directory for more information about how each works.
 */

module.exports = {

  /** @type {SlackError} Attach the custom type to the SlackAPI for consumer access */
  SlackError: SlackError,

  /**
   * Return a newly initialized OAuth API client with the provided credentials. You can
   * use this client to interact with the OAuth authorization endpoints & token exchange
   * for new users.
   * See {@link https://api.slack.com/methods/oauth.access} for more information.
   *
   * @param  {Object} config  A configuration object for SlackOAuthClient, must include `clientID` & `clientSecret`
   * @return {SlackAPIClient}
   */
  getOAuthClient: function getAPIClient(config) {
    return new SlackOAuthClient(config);
  },

  /**
   * Return a newly initialized API client with the provided access token. You can use
   * this client to interact with any API method on behalf of the user.
   * See {@link https://api.slack.com/web#basics} for more information.
   *
   * @param  {Object|string} config A configuration object for SlackAPIClient, or a single `token` value
   * @return {SlackAPIClient}
   */
  getAPIClient: function getAPIClient(config) {
    if (typeof config === 'string') {
      config = {token: config};
    }
    return new SlackAPIClient(config);
  },

  /**
   * Return a newly initialized Webhook client with the provided webhook URL. You can use
   * this client to send requests to a provided Incoming Webhook.
   * See {@link https://api.slack.com/incoming-webhooks} for more information.
   *
   * @param  {string} webhookURL
   * @return {SlackWebhookClient}
   */
  getWebhookClient: function getWebhookClient(webhookURL) {
    return new SlackWebhookClient({
      webhookURL: webhookURL
    });
  }

};
