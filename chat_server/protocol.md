## Websocket Communication protocol
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


