slackey - A dependable JavaScript SDK for Slack
==============

```
npm install slackey
```

## Why Slackey?

There are already plenty of libraries written for the Slack API. Why write another one?

- **First-Class API Support:** Most Slack SDKs that I originally came across either had limited support outside of webhooks, or none at all. With Slackey, a good API experience is the only focus.
- **Frontend & Backend Ready:** Slackey is committed to work in node, iojs, and even the browser (via [browserify](http://browserify.org/)).
- **Dependable:** Stability is a top priority for Slackey. Any issues and pull requests will be addressed quickly, and bug fixes will be prioritized whenever possible.

## Usage

### Initialize Slackey

```js
var SlackAPI = require('slackey');

var slackAPI = SlackAPI({
  clientID: 'XXX' // Optional
  clientSecret: 'XXX' // Optional
  apiURL: 'https://slack.com/api/' // Optional
});
```

### Get an API Access Token

```js
slackAPI.getAuthToken('USER_AUTH_CODE', function(err, response) {
  console.log(response);
  // {access_token: 'XXX', scope: 'read'}
}
```


### Get an API Client

```js
var slackAPIClient = slackAPI.getClient('USER_AUTH_TOKEN');
```

### Make Calls to the API

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
