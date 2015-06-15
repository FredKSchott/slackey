'use strict';

////////////////////////////////////////////////////////////////////////////////
// Requirements
////////////////////////////////////////////////////////////////////////////////

var assert = require('assert');
var SlackError = require('../slack-error');
var makeAPIRequest = require('../make-api-request');


////////////////////////////////////////////////////////////////////////////////
// Public
////////////////////////////////////////////////////////////////////////////////

/**
 * SlackOAuthClient - A client for working with the Slack OAuth authorization API endpoints.
 *
 * @constructor
 * @param {Object} options A collection of options to configure the client.
 * @param {string} options.clientID Your application's "client ID", required for working with auth codes
 * @param {string} options.clientSecret Your application's "client Secret", required for working with auth codes
 * @param {string} [options.authRedirectURI] The default redirect URL your application uses during OAuth authentication
 * @param {string} [options.apiURL='https://slack.com/api/'] The base API URL to communicate with
 * @return {void}
 */
var SlackOAuthClient = module.exports = function SlackOAuthClient(options) {
  options = options || {};
  this.clientID = options.clientID;
  this.clientSecret = options.clientSecret;
  this.authRedirectURI = options.authRedirectURI;
  this.apiURL = options.apiURL || 'https://slack.com/api/';
  assert(this.clientID, 'a "clientID" option is required to authorize users with the Slack API.');
  assert(this.clientSecret, 'a "clientSecret" option is required to authorize users with the Slack API.');
};

/** @type {SlackError} Attach the custom type to the SlackOAuthClient for consumer access */
SlackOAuthClient.prototype.SlackError = SlackError;

/**
 * Call the 'oauth.access' token endpoint with the client credentials & given options, and
 * return a valid Slack API Access Token object. See {@link https://api.slack.com/methods/oauth.access}
 * for more information.
 *
 * @param {string} code
 * @param {Object} [options] An optional collection of authorization options
 * @param {string} [options.redirectURI] The redirect URI that generated the original OAuth
 *  code, defaults to the `authRedirectURI` option if one was provided on client creation.
 * @param {Function} [callback] An optional callback to propagate the response to.
 * @callback {[Error, ResponseBody]}
 */
SlackOAuthClient.prototype.getToken = function(oauthCode, options, callback) {

  // If a callback was provided as the second argument, fix our args
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    options = options || {};
    callback = callback || function () {/* no-op */};
  }

  var redirectURI = options.redirectURI || this.authRedirectURI;
  var requestOptions = {
    url: this.apiURL + 'oauth.access',
    method: 'POST',
    form: {
      client_id: this.clientID,
      client_secret: this.clientSecret,
      code: oauthCode,
      redirect_uri: redirectURI
    }
  };
  makeAPIRequest(requestOptions, callback);
};
