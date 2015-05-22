'use strict';

////////////////////////////////////////////////////////////////////////////////
// Requirements
////////////////////////////////////////////////////////////////////////////////

var request = require('request');
var assign = require('object-assign');
var SlackError = require('./slack-error');


////////////////////////////////////////////////////////////////////////////////
// SlackAPIClient
////////////////////////////////////////////////////////////////////////////////

var SlackAPIClient = module.exports = function SlackAPIClient(options) {
  options = options || {};
  this.token = options.token;
  this.apiURL = options.apiURL;
};

/** @type {SlackError} Attach the custom type to the SlackAPIClient for consumer access */
SlackAPIClient.prototype.SlackError = SlackError;

/**
 * Execute the request. An error is propagated if there was a problem making the
 * request or recieving the response. All completed responses, even those that
 * resulted in erroneus status codes, will be propagated to the consumer.
 *
 * Note that we call the user's callback with the response body first, followed
 * by the full response object. With Slack's API, the body should be all you need
 * to properly handle the response.
 *
 * @internalonly This method should only be used internally to the slackey module.
 * @param {Options} requestOptions
 * @param {Function} callback
 * @callback {[Error, ResponseBody, Response]}
 */
SlackAPIClient.prototype.makeRequest = function(requestOptions, callback) {
  // Default to JSON always, unless explicitly told otherwise
  requestOptions.json = (typeof requestOptions.json !== 'undefined') ? requestOptions.json : true;

  request(requestOptions, function(err, response) {
    if (err) {
      callback(err);
      return;
    }
    if (!response.body.ok) {
      callback(new SlackError(response.body.error));
      return;
    }
    callback(null, response.body);
  });
};


/**
 * Call an API method following Slack's API calling conventions.
 * See {@link https://api.slack.com/web#basics} for more information.
 *
 * @param {string} method The API method to call.
 * @param {Object} [options] An optional collection of API method arguments.
 * @param {Function} [callback] An optional callback to propagate the response to.
 * @callback {[Error, ResponseBody, Response]}
 */
SlackAPIClient.prototype.api = function(method, options, callback) {
  // If a callback was provided as the second argument, fix our args
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    options = assign({}, options);
    callback = callback || function () {/* no-op */};
  }

  var requestOptions = {
    url: this.apiURL + method
  };

  // Attach the API access token as a method argument
  options.token = this.token;

  // Perform special logic for special methods like 'files.upload'
  switch (method) {

    case 'files.upload':
      // The 'file' option requires a special multi-part formData upload
      if (options.file) {
        requestOptions.formData = {file: options.file};
        delete options.file;
      }
      // The 'content' option requires a special x-www-form-urlencoded POST variable
      if (options.content) {
        requestOptions.form = {content: options.content};
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

  this.makeRequest(requestOptions, callback);
};
