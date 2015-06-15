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
 * Execute the API request. An error is propagated if there was a problem making the
 * request or recieving the response. If `ok` is false, a special SlackError will be
 * propagated to the callback with Slack's information about the error.
 *
 * Note that we call the user's callback with only response body, and not the full
 * object. With Slack's API, the body should be all you need to properly handle the
 * response.
 *
 * @param {Options} requestOptions
 * @param {Function} callback
 * @callback {[Error, ResponseBody]}
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
    // OK is always true, so no need to return it with the rest of the response
    delete response.body.ok;
    callback(null, response.body);
  });
};
