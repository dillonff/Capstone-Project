## Websocket Communication protocol
#### The websocket aims to push events to clients, such as new messages and channel info changed.
After established websocket connection, the client should send a websocket message with token in json (e.g. the following payload) for authentication.
See WebsocketHandler and chat_webclient/src/event.js for details.
```json5
{
  "type": "auth",
  "args": {
    "token": "xxx-xxxxxxxx..."
  }
}
```

Only push messages

### server push message
```json
{
  "type": "type-string",
  "data": {...}
}
```

#### New Message
```json5
{
  "type": "newMessage",
  "data": {
    // just the Message entity
  }
}
```

#### Information changed
```json
{
  "type": "infoChanged",
  "data": {
    "infoType": "channel|workspace|..."
  }
}
```


