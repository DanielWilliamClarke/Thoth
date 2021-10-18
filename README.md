<p align="center">
  <img src="./assets/dry.png"/>
<p>

# Thoth

Aspectjs Contextual Logging POC

- [Thoth](#thoth)
  - [References](#references)
  - [Commands](#commands)
  - [Expected logs for api/command endpoint](#expected-logs-for-apicommand-endpoint)

## References

- NestJS Pino - Platform agnostic logger for NestJS based on Pino with REQUEST CONTEXT IN EVERY LOG - <https://github.com/iamolegga/nestjs-pino>
- AspectJS - Library for aspect-oriented programming with JavaScript, which takes advantage of ECMAScript 2016 decorators syntax - <https://github.com/mgechev/aspect.js>
- express-request-id - Generate UUID for request and add it to X-Request-Id header. In case request contains X-Request-Id header, uses its value instead - <https://www.npmjs.com/package/express-request-id>

## Commands

```TypeScript
// Setup
npm install
npm run build
npm run start

// Lint
npm run lint
// Fix
npm run fix

// Test
...lol ...lmao
```

Once the service is running you can make requests to it with curl

```Bash
curl -v -H "X-Request-Id: your-x-request-id" localhost:3000/api/
# *   Trying 127.0.0.1:3000...
# * TCP_NODELAY set
# * Connected to localhost (127.0.0.1) port 3000 (#0)
# > GET /api HTTP/1.1
# > Host: localhost:3000
# > User-Agent: curl/7.67.0
# > Accept: */*
# > X-Request-Id: your-x-request-id
# >
# * Mark bundle as not supporting multiuse
# < HTTP/1.1 200 OK
# < X-Powered-By: Express
# < X-Request-Id: your-x-request-id
# < Content-Type: text/html; charset=utf-8
# < Content-Length: 12
# < ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"
# < Date: Mon, 18 Oct 2021 12:26:36 GMT
# < Connection: keep-alive
# < Keep-Alive: timeout=5
# <
# Hello World!* Connection #0 to host localhost left intact

curl -H "X-Request-Id: your-x-request-id" localhost:3000/api/command
//{"some":"useful","data":"which","we":"need","something":"that","I":"need","To":"Find"}
```

if no X-Request-Id is provided this service will generate one to be available in the response headers (see below for details)

## Expected logs for api/command endpoint

```JSON
// curl localhost:3000/api/command
{
    "level": 30,
    "time": 1634559138326,
    "pid": 28652,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "52bfec56-d823-42c7-8d40-5855361771db", // <- x-request-id generated
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*",
            "x-request-id": "52bfec56-d823-42c7-8d40-5855361771db"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 60947
    },
    "context": "AspectLogger",
    "msg": "Inside of the logger. Called AppService.runCommand with args: []."
}
{
    "level": 30,
    "time": 1634559138327,
    "pid": 28652,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "52bfec56-d823-42c7-8d40-5855361771db",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*",
            "x-request-id": "52bfec56-d823-42c7-8d40-5855361771db"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 60947
    },
    "context": "AspectLogger",
    "msg": "Inside of the logger. Called Command.DoThing with args: [{\"data\":\"Complex query string\",\"attributes\":{\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}}]."
}
{
    "level": 30,
    "time": 1634559138327,
    "pid": 28652,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "52bfec56-d823-42c7-8d40-5855361771db",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*",
            "x-request-id": "52bfec56-d823-42c7-8d40-5855361771db"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 60947
    },
    "context": "AspectLogger",
    "msg": "Inside of the logger. Called Repository.Get with args: [{\"data\":\"Complex query string\",\"attributes\":{\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}}]."
}
{
    "level": 30,
    "time": 1634559138328,
    "pid": 28652,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "52bfec56-d823-42c7-8d40-5855361771db",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*",
            "x-request-id": "52bfec56-d823-42c7-8d40-5855361771db"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 60947
    },
    "context": "AspectLogger",
    "msg": "Inside of the logger. Called DataAccess.Get with args: [\"Complex query string\",{\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}]."
}
Using Complex query string to make a query
{
    "level": 30,
    "time": 1634559138334,
    "pid": 28652,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "52bfec56-d823-42c7-8d40-5855361771db",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*",
            "x-request-id": "52bfec56-d823-42c7-8d40-5855361771db"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 60947
    },
    "res": {
        "statusCode": 200,
        "headers": {
            "x-powered-by": "Express",
            "x-request-id": "52bfec56-d823-42c7-8d40-5855361771db",
            "content-type": "application/json; charset=utf-8",
            "content-length": "86",
            "etag": "W/\"56-Px7oRE3ex14xXSLksTZp66ipZiY\""
        }
    },
    "responseTime": 10,
    "msg": "request completed"
}

```
