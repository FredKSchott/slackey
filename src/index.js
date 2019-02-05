

////////////////////////////////////////////////////////////////////////////////
// Requirements
////////////////////////////////////////////////////////////////////////////////

import {SlackAPIClient} from './clients/api-client';
import {SlackOAuthClient} from './clients/oauth-client';
import {SlackWebhookClient} from './clients/webhook-client';


////////////////////////////////////////////////////////////////////////////////
// Slackey
////////////////////////////////////////////////////////////////////////////////

/**
 * Slackey - A library for working with the Slack API. Slackey can interact with the
 * API via webhooks, or on behalf of a user via API & OAuth clients. See the `/clients`
 * directory for more information about how each works.
 */

/** @type {SlackError} Attach the custom type to the SlackAPI for consumer access */
export {SlackError} from './slack-error';

/**
 * Return a newly initialized OAuth API client with the provided credentials. You can
 * use this client to interact with the OAuth authorization endpoints & token exchange
 * for new users.
 * See {@link https://api.slack.com/methods/oauth.access} for more information.
 *
 * @param  {Object} config  A configuration object for SlackOAuthClient, must include `clientID` & `clientSecret`
 * @return {SlackAPIClient}
 */
export function getOAuthClient(config) {
  return new SlackOAuthClient(config);
};

/**
 * Return a newly initialized API client with the provided access token. You can use
 * this client to interact with any API method on behalf of the user.
 * See {@link https://api.slack.com/web#basics} for more information.
 *
 * @param  {Object|string} config A configuration object for SlackAPIClient, or a single `token` value
 * @return {SlackAPIClient}
 */
export function getAPIClient(config) {
  if (typeof config === 'string') {
    config = {token: config};
  }
  return new SlackAPIClient(config);
};

/**
 * Return a newly initialized Webhook client with the provided webhook URL. You can use
 * this client to send requests to a provided Incoming Webhook.
 * See {@link https://api.slack.com/incoming-webhooks} for more information.
 *
 * @param  {string} webhookURL
 * @return {SlackWebhookClient}
 */
export function getWebhookClient(webhookURL) {
  return new SlackWebhookClient({
    webhookURL: webhookURL
  });
}