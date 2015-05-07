Slackey
==============

A dependable Slack SDK written in JavaScript. 

```
npm install slackey
```

## Why Slackey?
There are already [plenty](https://www.npmjs.com/package/node-slack) [of](https://www.npmjs.com/package/slack-api) [JavaScript](https://www.npmjs.com/package/slack-client) [libraries](https://www.npmjs.com/package/slack-node) [out there](https://www.npmjs.com/package/slack-notify) written for the Slack API. Why build another one?

- **First-Class API Support:** Most Slack SDKs that I originally came across had either limited API support outside of webhooks, or no support at all. With Slackey, a good API experience is the primary focus.
- **Dependable:** Stability is a top priority for Slackey. Any issues and pull requests will be addressed quickly, and bug fixes will be prioritized whenever possible.
- **Frontend & Backend Ready:** Slackey is committed to work in node, iojs, and even the browser (via [browserify](http://browserify.org/)).

## Usage

### Initialize Slackey

```js
var SlackAPI = require('slackey');

var slackAPI = new SlackAPI({
  clientID: 'XXX', // Optional
  clientSecret: 'XXX', // Optional
  apiURL: 'https://slack.com/api/', // Optional
});
```

### Get an API Access Token

```js
// NOTE: clientID & clientSecret are both required to get access tokens
slackAPI.getAccessToken('USER_AUTH_CODE', function(err, response) {
  console.log(response);
  // {access_token: 'XXX', scope: 'read'}
}
```

### Get an API Client

```js
var slackAPIClient = slackAPI.getClient('USER_ACCESS_TOKEN');
```

### Make Calls to the API

**`slackAPIClient.api(method, [arguments,] [callback])`** -  Call any Slack API method with an optional set of arguments. 

```js
// Get the list of users on your team
slackAPIClient.api('users.list', function(err, response) {
  console.log(response);
  // {ok: true, members: ...
});

// Post a message from your application
slackAPIClient.api('chat.postMessage',
  {
    text: 'hello from nodejs! I am a robot, beep boop beep boop.',
    channel: '#channel'
  },
  function(err, response) {
    console.log(response);
    // {ok: true, channel: ...
  }
);
```
