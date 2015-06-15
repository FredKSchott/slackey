'use strict';

////////////////////////////////////////////////////////////////////////////////
// Requirements
////////////////////////////////////////////////////////////////////////////////

var request = require('request');
var SlackError = require('./slack-error');


////////////////////////////////////////////////////////////////////////////////
// Public
////////////////////////////////////////////////////////////////////////////////

/**
 * Execute the Webhook request. An error is propagated if there was a problem making
 * the request or recieving the response. If the response body is not 'ok' a special
 * SlackError will be propagated to the callback with information about the error.
 *
 * @param {Options} requestOptions
 * @param {Function} callback
 * @callback {[Error]}
 */
module.exports = function makeAPIRequest(requestOptions, callback) {
  request(requestOptions, function(err, response) {
    if (err) {
      callback(err);
      return;
    }
    if (response.body !== 'ok') {
      callback(new SlackError(response.body));
      return;
    }
    callback(null);
  });
};
