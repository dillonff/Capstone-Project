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
    "channel": "channel-id"
  }
}
```
```json
{
  "type": "res",
  "success": true
}
```

#### Get historical Messages
```json
{
  "type": "getMessage",
  "args": {
    "channel": "channel-id",
    "id": "(optional) message-id",
    "afterId": "(optional) return messages after this id",
    "afterTime": "(optional) return messages after "
  }
}
```
```json
{
  "type": "res",
  "success": true,
  "result": {
    
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
    "workspace": "workspace-id"
  }
}
```
```json
{
  "type": "res",
  "success": true,
  "result": {
    "channelId": "channel-id"
  }
}
```

#### Add user to channel
```json
{
  "type": "joinChannel",
  "args": {
    "channel": "channel-id",
    "workspace": "workspace-id",
    "user": "user-id"
  }
}
```
```json
{
  "type": "res",
  "success": true,
  "result": {
    "channelId": "channel-id"
  }
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
  "success": true,
  "result": {
    "channels": []
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
  "id": "channel-id"
}
```
```json
{
  "type": "res",
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
    "messageId": "message-id"
  }
}
```


