<a href="https://www.npmjs.com/package/slackey">
  <img align="right" src="https://nodei.co/npm/slackey.png?compact=true" />
</a>
# Slackey

There are already [plenty](https://www.npmjs.com/package/node-slack) [of](https://www.npmjs.com/package/slack-api) [JavaScript](https://www.npmjs.com/package/slack-client) [libraries](https://www.npmjs.com/package/slack-node) [out there](https://www.npmjs.com/package/slack-notify) written for the Slack API. Why build another one? And more importantly, why use this one?

- **First-Class Web API Support:** Most Slack SDKs have either limited API support outside of webhooks, or no support at all. With Slackey, a good web API experience is the focus.
- **Webhooks Support:** With version v1.0, "Incoming Webhooks" support is also available.
- **Dependable:** Stability is another top priority for Slackey. Slackey is fully tested, and any issues and pull requests will be addressed quickly. Bug fixes will be prioritized whenever possible.
- **Frontend & Backend Ready:** Slackey is committed to work in node, iojs, and even the browser (via [browserify](http://browserify.org/)).

```
npm install --save slackey
```

## Usage

### Initialize Slackey

```js
var Slackey = require('slackey');

var slackAPI = new Slackey({
  // Required to call slackAPI.getAccessToken()
  clientID: 'XXX',
  clientSecret: 'XXX',
  // Optional
  apiURL:          // Defaults to: 'https://slack.com/api/'
  authRedirectURI: // (no default)
});
```

### Get an API Access Token

**`slackAPI.getAccessToken(options, callback)`** - Exchange a valid OAuth authentication code for an API access token via the 'oauth.access' method.

Supported options:
- `code`: A valid, fresh OAuth auth code
- `redirectURI`: (Optional) The redirect URI used to get the provided auth code, if one was provided. Defaults to the `authRedirectURI` value provided to the constructor.

```js
slackAPI.getAccessToken({
  code: 'USER_AUTH_CODE',
  redirectURI: 'http://localhost:5000/auth/slack/return',
}, function(err, response) {
  console.log(err, response);
  // null {access_token: 'XXX', scope: 'read'}
}
```


### Make Calls to the Web API

```js
var slackAPIClient = slackAPI.getAPIClient('USER_ACCESS_TOKEN');
```

**`slackAPIClient.send(method, [arguments,] [callback(err, responseBody)])`**  - Call any Slack API method with an optional set of arguments. Authentication is automatically inherited from the client's authorized access token.

```js
// Get the list of users on your team
slackAPIClient.send('users.list', function(err, response) {
  console.log(err, response);
  // null {members: ...
});

// Post a message from your application
slackAPIClient.send('chat.postMessage',
  {
    text: 'hello from nodejs! I am a robot, beep boop beep boop.',
    channel: '#channel'
  },
  function(err, response) {
    console.log(err, response);
    // null {channel: ...
  }
);
```

*Note on `responseBody` object: Because the response body is only propagated when `ok: true` (see Errors section below) we remove that property from the response that we return. We do this because it is redundant, and so that all properties are related to the resource/response and not the status of that response.*

#### Errors

Any error object that occurs while making the request or recieving the response will be propagated to the callback.

Any failed results from the Slack API (where `ok: false`) will propagate a custom `SlackError` error object with the error message provided by Slack. Check for this type of error specifically to handle all possible, expected error cases.


```js
slackAPIClient.send('channels.create', {name: 'mychannel'}, function(err, response) {
  if (err) {
    if (err.message === 'name_taken') {
      // Handle the case where the channel name already exists
    } else if (err.message === 'restricted_action') {
      // Handle the case where the authed user is restricted from doing this
    } else if (err instanceOf slackAPIClient.SlackError) {
      // Handle all possible slack errors
    } else {
      // Handle all other errors, like errors making the request/response
    }
  }
  // Handle the successful response...
);
```


### Make Calls to an Incoming Webhook

```js
var slackWebhookClient = slackAPI.getWebhookClient('WEBHOOK_URL');
```

**`slackWebhookClient.send(payload, [callback(err)])`**  - Call a Slack webhook with a given set of arguments.

```js
slackWebhookClient.send({
    text: 'hello from nodejs! I am a robot, beep boop beep boop.',
    icon_emoji: ':ghost:'
}, function(err) {
  console.log(err); // null
});
```

#### Errors

Any error object that occurs while making the request or recieving the response will be propagated to the callback.

Any failed results from the Slack API (where response body is not `ok`) will propagate a custom `SlackError` error object with the error message provided by Slack. Check for this type of error specifically to handle all possible, expected error cases.


```js
slackWebhookClient.send({"username": "monkey-bot"}, console.log)
// { [SlackError: No text specified] name: 'SlackError', message: 'No text specified' }
```

