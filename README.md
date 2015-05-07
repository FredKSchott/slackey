Slackey
==============

There are already [plenty](https://www.npmjs.com/package/node-slack) [of](https://www.npmjs.com/package/slack-api) [JavaScript](https://www.npmjs.com/package/slack-client) [libraries](https://www.npmjs.com/package/slack-node) [out there](https://www.npmjs.com/package/slack-notify) written for the Slack API. Why build another one? And more importantly, why use this one?

- **First-Class API Support:** Most Slack SDKs that I originally came across had either limited API support outside of webhooks, or no support at all. With Slackey, a good API experience is the primary focus.
- **Dependable:** Stability is a top priority for Slackey. Any issues and pull requests will be addressed quickly, and bug fixes will be prioritized whenever possible.
- **Frontend & Backend Ready:** Slackey is committed to work in node, iojs, and even the browser (via [browserify](http://browserify.org/)).

```
npm install slackey
```

## Usage

### Initialize Slackey

```js
var SlackAPI = require('slackey');

var slackAPI = new SlackAPI({
  // Required for getting access tokens:
  clientID: 'XXX',
  clientSecret: 'XXX',
  // Optional:
  apiURL: 'https://slack.com/api/',
  authRedirectURI: 'XXX',
});
```

### Get an API Access Token

```js
// NOTE: clientID & clientSecret are both required to get access tokens
slackAPI.getAccessToken({
  code: 'USER_AUTH_CODE',
  redirectURI: 'http://localhost:5000/auth/slack/return', // Optional, defaults to `authRedirectURI`
}, function(err, response) {
  console.log(err, response);
  // null {access_token: 'XXX', scope: 'read'}
}
```

### Get an API Client

```js
var slackAPIClient = slackAPI.getClient('USER_ACCESS_TOKEN');
```

### Make Calls to the API

**`slackAPIClient.api(method, [arguments,] [callback])`**  - Call any Slack API method with an optional set of arguments.

```js
// Get the list of users on your team
slackAPIClient.api('users.list', function(err, response) {
  console.log(err, response);
  // null {ok: true, members: ...
});

// Post a message from your application
slackAPIClient.api('chat.postMessage',
  {
    text: 'hello from nodejs! I am a robot, beep boop beep boop.',
    channel: '#channel'
  },
  function(err, response) {
    console.log(err, response);
    // null {ok: true, channel: ...
  }
);
```

#### Errors

An error object will be propagated if there was a problem making the request or recieving the response. All completed responses, even those that resulted in erroneus status codes, will be propagated to the consumer without an error.

#### Additional Response Info

The body of a Slack API response will usually have all the information you need about the success or failure of a request. However, if you do need access to the full response object (provided by [request](https://github.com/request/request)) it is provided as an optional third argument to the callback. Use as needed.
