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


## Endpoints
### __The doc was moved to postman, please see the postman page__
[https://www.postman.com/xy-pm/workspace/comp5703](https://www.postman.com/xy-pm/workspace/comp5703)

#### Auth
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
    "token": "xxx-xxxxxxxxxx..."
}
```

