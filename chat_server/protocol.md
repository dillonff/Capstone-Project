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
```json
{
  "type": "newMessage",
  "data": {
    "messageId": "message-id",
    "preview": "preview text",
    "senderId": "numeric sender id",
    "channelId": "numeric channel id"
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


