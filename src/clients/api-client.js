

////////////////////////////////////////////////////////////////////////////////
// Requirements
////////////////////////////////////////////////////////////////////////////////

import assert from 'assert';
import querystring from 'querystring';
import {SlackError} from '../slack-error';
import {makeAPIRequest} from '../make-api-request';


////////////////////////////////////////////////////////////////////////////////
// Public
////////////////////////////////////////////////////////////////////////////////

/**
 * SlackAPIClient - A client for working with the Slack Web API endpoints. These endpoints
 * require an authorized user's access token to work, so each SlackAPIClient instance requires
 * one on creation to use on all future requests. A token can be recieved via SlackOAuthClient.
 *
 * @constructor
 * @param {Object} options A collection of options to configure the client.
 * @param {string} options.token An API Access Token to use for authorization of each call
 * @param {string} [options.apiURL='https://slack.com/api/'] The base API URL to communicate with
 * @return {void}
 */
export function SlackAPIClient(options) {
  options = options || {};
  this.token = options.token;
  this.apiURL = options.apiURL || 'https://slack.com/api/';
  assert(this.token, 'a "token" option is required to make calls to the Slack API.');
};

/** @type {SlackError} Attach the custom type to the SlackAPIClient for consumer access */
SlackAPIClient.prototype.SlackError = SlackError;

/**
 * Call an API method following Slack's API calling conventions.
 * See {@link https://api.slack.com/web#basics} for more information.
 *
 * @param {string} method The API method to call.
 * @param {Object} [options] An optional collection of API method arguments.
 * @param {Function} [callback] An optional callback to propagate the response to.
 * @callback {[Error, ResponseBody, Response]}
 */
SlackAPIClient.prototype.send = function(method, options, callback) {
  // If a callback was provided as the second argument, fix our args
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    options = Object.assign({}, options);
    callback = callback || function () {/* no-op */};
  }

  var requestOptions = {
    url: this.apiURL + method
  };

  // Attach the API access token as a method argument
  options.token = this.token;

  // Perform special logic for special methods like 'files.upload'
  switch (method) {

    case 'chat.postMessage':
      // attachments array needs to be a string, so stringify if needed
      if (Array.isArray(options.attachments)) {
        options.attachments = JSON.stringify(options.attachments);
      }

      // We default to a POST request here because long messages will exceed the ~2000 character
      // limit in the url for a GET request.
      requestOptions.method = 'POST';
      requestOptions.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
      requestOptions.body = querystring.stringify(options);
      break;

    case 'files.upload':
      // The 'file' option requires a special multi-part formData upload
      if (options.file) {
        requestOptions.formData = {file: options.file};
        delete options.file;
      }
      // The 'content' option requires a special x-www-form-urlencoded POST variable
      if (options.content) {
        requestOptions.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        requestOptions.body = querystring.stringify({content: options.content});
        delete options.content;
      }
      // Requires a POST upload instead of the normal GET request
      requestOptions.method = 'POST';
      requestOptions.qs = options;
      break;

    default:
      requestOptions.method = 'GET';
      requestOptions.qs = options;
  }

  makeAPIRequest(requestOptions, callback);
};
