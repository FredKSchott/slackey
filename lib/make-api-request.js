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
 * Execute the request. An error is propagated if there was a problem making the
 * request or recieving the response. All completed responses, even those that
 * resulted in erroneus status codes, will be propagated to the consumer.
 *
 * Note that we call the user's callback with only response body, and not the full
 * object. With Slack's API, the body should be all you need to properly handle the
 * response.
 *
 * @param {Options} requestOptions
 * @param {Function} callback
 * @callback {[Error, ResponseBody, Response]}
 */
module.exports = function makeAPIRequest(requestOptions, callback) {
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