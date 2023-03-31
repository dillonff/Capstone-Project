## Entities
Channel, Message, User, Workspace, LastRead

## Communication protocol
The server and client communicates in json using websocket text mode. There are two types of communication flows:
### request-response
#### Client
```json
{
  "type": "type-string",
  "args": {...}
}
```
#### Server
```json
{
  "type": "res",
  "request": "request type-string",
  "success": true,
  "message": "error message description",
  "result": {...}
}
```


### Types
#### Auth (temporary)
```json
{
  "type": "auth",
  "args": {
    "userName": "something"
  }
}
```
```json
{
  "type": "res",
  "request": "auth",
  "success": true,
  "result": {
    "userId": "user-id",
    "clientId": "websocket id"
  }
}
```

#### Send message
```json
{
  "type": "sendMessage",
  "args": {
    "content": "message content",
    "channel": "numeric channel-id"
  }
}
```
```json
{
  "type": "res",
  "request": "sendMessage",
  "success": true,
  "result": {
    "messageId": 114514
}
}
```

#### Get historical Messages
```json
{
  "type": "getMessages",
  "args": {
    "channel": "numeric channel-id",
    "id": "(optional) message-id",
    "afterId": "(optional) return messages after this id",
    "afterTime": "(optional) return messages after "
  }
}
```
```json
{
  "type": "res",
  "request": "getMessages",
  "success": true,
  "result": {
    "messages": [1, 2, 4, 8, 16]
  }
}
```

#### Create Channel
* A default channel named "general" will be automatically created when the server is starting.
* Any online users will be automatically joined into the general channel
```json
{
  "type": "createChannel",
  "args": {
    "name": "channel name",
    "workspace": "numeric workspace-id"
  }
}
```
```json
{
  "type": "res",
  "request": "createChannel",
  "success": true,
  "result": {
    "channelId": "numeric channel-id"
  }
}
```

#### Add user to channel
```json
{
  "type": "joinChannel",
  "args": {
    "channel": "channel-id",
    "user": "user-id"
  }
}
```
```json
{
  "type": "res",
  "request": "joinChannel",
  "success": true
}
```

#### Get Channels
```json
{
  "type": "getChannels",
  "args": {
    "workspace": "workspace-id"
  }
}
```
```json
{
  "type": "res",
  "request": "getChannels",
  "success": true,
  "result": {
    "channelIds": []
  }
}
```

#### Get User info
```json
{
  "type": "getUserInfo",
  "id": "user-id"
}
```
```json
{
  "type": "res",
  "request": "getUserInfo",
  "success": true,
  "result": {
    "id": 23333,
    "name": "Name of The User"
  }
}
```
#### Get Channel info

```json
{
  "type": "getChannelInfo",
  "args": {
    "channelId": "numeric channel-id"
  },
}
```
```json
{
  "type": "res",
  "request": "getChannelInfo",
  "success": true,
  "result": {
    "id": 23333,
    "name": "Name of The Channel"
  }
}
```

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
    "senderId": "numeric sender id"
  }
}
```


