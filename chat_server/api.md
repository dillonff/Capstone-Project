## Note
* Please follow this API style: [https://api.gov.au/sections/api-response.html#http-response-codes](https://api.gov.au/sections/api-response.html#http-response-codes)
* An example with swaggerUI (for style guide only): [https://generator.swagger.io/?url=https://raw.githubusercontent.com/secure-mail-documentation-project/protonmail-api/main/protonmail-api.yaml](https://generator.swagger.io/?url=https://raw.githubusercontent.com/secure-mail-documentation-project/protonmail-api/main/protonmail-api.yaml)
* What is a `PathVariable`? `/path/to/resources/{pathVariableName}/something/else`
* What is a `RequestParam`? `/path/to/resources?requestParamName1=value1&requestParamName2=value2`
* What is a `RequestBody`? Just the json input.
* Create classes in the model package for serialization and deserialization.
* Authentication is done by providing the Authorization header with appropriate token. See the example header.
* In order to obtain a token, post username and password to `/api/v1/auth`
* Content type 'application/json' must be specified if the request has a payload, and you must use cors mode, otherwise you will get 415

#### Example headers:
```http request
Authorization: 1-767e7f7837b440301c181716b2c82c986ea5eab868718fdf7ed1d52b580d9cba
Content-Type: application/json
```

### __This document is out of date, some APIs are documented in the postman page__
[https://www.postman.com/xy-pm/workspace/comp5703](https://www.postman.com/xy-pm/workspace/comp5703)

## Endpoints
#### Auth (temporary)
`POST /api/v1/auth`
##### RequestBody
```json
{
  "username": "something",
  "password": "1234"
}
```
##### Response
```json
{
    "userId": "user-id"
}
```

#### Send message
`POST /api/v1/messages/send`
##### RequestBody
```json
{
  "content": "message content",
  "channelId": "numeric channel-id"
}
```
Response
```json
{
  "messageId": 114514
}
```

#### Get historical Messages (draft)
`GET /api/v1/messages`
##### RequestParam
* `channelId: which channel to get message from`
* `page: the page index, defaults to 0`
* `pageSize: the page size defaults to ? (the max number of messages to return in this page)`
* `isDesc: how do you want to order the messages? defaults to 1, 1 => descending, 0 => ascending`
* `afterId: return messages after this id`
* `beforeId: return messages before this id`
##### Response
```json
{
  "messageIds": [16, 8, 4, 2, 1]
}
```

#### Get single message detail
`GET /api/v1/messages/{messageId}`
##### PathVariable
* messageId
##### Response
```json
{
  "id": 123,
  "content": "message content",
  "channelId": 123,
  "senderId": 123,
  ...
}
```

#### Create Channel
* A default channel named "general" will be automatically created when a workspace is created.
* Any users in that channel will be automatically joined into the general channel.

`POST /api/v1/channels`
##### RequestBody
```json
{
  "name": "channel name",
  "workspaceId": "numeric workspace-id"
}
```
##### Response
```json
{
  "channelId": "numeric channel-id"
}
```

#### Add user to channel
`POST /api/v1/channels/join`
##### RequestBody
```json
{
  "channelId": "channel-id",
  "userId": "user-id"
}
```
##### Response
```json
{}
```

#### Pin a channel
`POST /api/v1/channels/{channelId}/pin`
##### RequestBody
```json
{
  "isPin": true
}
```
##### Response
```json
{}
```



#### Get Channels
`GET /api/v1/channels`
##### RequestParam
* `workspaceId`
##### Response
```json
{
  "channelIds": []
}
```

#### Get User info
`GET /api/v1/users/{userId}`
##### PathVariable
* `userId`
##### Response
```json
{
  "id": 23333,
  "name": "Name of The User"
}
```

#### Get Channel info
`GET /api/v1/channels/{channelId}`
##### PathVariable
* `channelId`
```json
{
  "id": 23333,
  "name": "Name of The Channel"
}
```

#### Create workspace
`POST /api/v1/workspaces`
##### RequestBody
```json
{
  "name": "workspace name"
}
```

#### Get workspace info
`GET /api/v1/workspaces/{workspaceId}`  
##### PathVariable
* workspaceId
##### Response
```json
{
  "id": 123,
  "name": "workspace-name",
  "memberIds": [1, 2, 4, 8],
  "channelIds": [1, 2, 3, 4]
}
```

#### Get workspace list
`GET /api/v1/workspaces`  
##### Response
```json
{
  "workspaceIds": [1, 2, 4, 8]
}
```

#### Create workspace
`POST /api/v1/workspaces`
##### RequestBody
```json
{
  "name": "workspace-name"
}
```
##### Response
(Same as get workspace info)

#### join workspace
`POST /api/v1/workspaces/join`
##### RequestBody
```json
{
  "workspaceId": 123,
  "userId": 456
}
```

