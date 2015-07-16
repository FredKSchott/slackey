'use strict';

/**
 * SlackError - Slack Response Error
 * An error occurred on the SLack API. The API response was sent and recieved
 * successfully, but Slack has sent back a response with 'ok=false'. This
 * error object will represent all information about that error, with a message
 * equal to the 'error' message from the response.
 *
 * @param {string} message The 'error' property of the Slack 'okay=false' response
 * @param {Object} [options] Additional information for logging
 * @param {Object} [options.response] A full response object from the request module
 */
function SlackError(message, options) {
  this.name = 'SlackError';
  this.message = message || 'Slack Response Error';
  if (options.response) {
    this.requestURL = options.response.request.href;
    this.responseBody = options.response.body;
  }
}

SlackError.prototype = Object.create(Error.prototype);
SlackError.prototype.constructor = SlackError;

module.exports = SlackError;
