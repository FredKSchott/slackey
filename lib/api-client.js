'use strict';

////////////////////////////////////////////////////////////////////////////////
// Requirements
////////////////////////////////////////////////////////////////////////////////

var querystring = require('querystring');
var assign = require('object-assign');
var SlackError = require('./slack-error');
var makeAPIRequest = require('./make-api-request');


////////////////////////////////////////////////////////////////////////////////
// Public
////////////////////////////////////////////////////////////////////////////////

var SlackAPIClient = module.exports = function SlackAPIClient(options) {
  options = options || {};
  this.token = options.token;
  this.apiURL = options.apiURL;
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

    case 'chat.postMessage':
      // attachments array needs to be a string, so stringify if needed
      if (Array.isArray(options.attachments)) {
        options.attachments = JSON.stringify(options.attachments);
      }
      requestOptions.method = 'GET';
      requestOptions.qs = options;
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
        requestOptions.body = querystring.stringify({content: options.content}).toString('utf8');
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
