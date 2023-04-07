## Note
* Please follow this API style: [https://api.gov.au/sections/api-response.html#http-response-codes](https://api.gov.au/sections/api-response.html#http-response-codes)
* An example with swaggerUI (for style guide only): [https://generator.swagger.io/?url=https://raw.githubusercontent.com/secure-mail-documentation-project/protonmail-api/main/protonmail-api.yaml](https://generator.swagger.io/?url=https://raw.githubusercontent.com/secure-mail-documentation-project/protonmail-api/main/protonmail-api.yaml)
* What is a `PathVariable`? `/path/to/resources/{pathVariableName}/something/else`
* What is a `RequestParam`? `/path/to/resources?requestParamName1=value1&requestParamName2=value2`
* What is a `RequestBody`? Just the json input.
* Create classes in the model package for serialization and deserialization.
* Authentication has not been implemented yet. In order to identify the client, put the user id in the Authentication header (see below for an example).
* To obtain a user id, POST to `/api/v1/auth` with a user name (see Auth).
* Content type 'application/json' must be specified if the request has a payload, and you must use cors mode, otherwise you will get 415

#### Example headers:
```http request
Authentication: 1
Content-Type: application/json
```

### TODO: this should migrate to postman or swaggerUI

## Endpoints
#### Auth (temporary)
`POST /api/v1/auth`
##### RequestBody:
```json
{
  "userName": "something"
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
```json
{
  "content": "message content",
  "channelId": "numeric channel-id"
}
```
```json
{
  "messageId": 114514
}
```

#### Get historical Messages (draft)
`GET /api/v1/messages`
##### RequestParam:
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
TODO

#### Get workspace list
`GET /api/v1/workspaces`  
TODO
