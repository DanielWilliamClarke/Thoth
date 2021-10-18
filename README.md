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
    "time": "2021-10-18T14:41:51.855Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95", // <- X-Request-Id generated
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "context": "AspectLogger",
    "msg": "Constructing logger",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-18T14:41:51.856Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "context": "AspectLogger",
    "msg": "Entering AppService.runCommand | args: []",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-18T14:41:51.857Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "context": "AspectLogger",
    "msg":"Entering Command.DoThing 
    | args: [
        {\"data\":\"Complex query string\",\"attributes\":{\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}}]",
            "severity": "INFO"
        }
{
    "level": 30,
    "time": "2021-10-18T14:41:51.857Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "context": "AspectLogger",
    "msg": "Entering Repository.Get | args: [{\"data\":\"Complex query string\",\"attributes\":{\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}}]",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-18T14:41:51.858Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "context": "AspectLogger",
    "msg": "Entering DataAccess.Get | args: [\"Complex query string\",{\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}]",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-18T14:41:51.859Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "msg": "Using Complex query string to make a query",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-18T14:41:51.860Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "context": "AspectLogger",
    "msg":"Exiting DataAccess.Get | 
result: {\"some\":\"useful\",\"data\":\"which\",\"we\":\"need\",\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}",
        "severity": "INFO"
    }
{
    "level": 30,
    "time": "2021-10-18T14:41:51.860Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "context": "AspectLogger",
    "msg":"Exiting Repository.Get | 
result: {\"some\":\"useful\",\"data\":\"which\",\"we\":\"need\",\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}",
        "severity": "INFO"
    }
{
    "level": 30,
    "time": "2021-10-18T14:41:51.861Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "context": "AspectLogger",
    "msg": "Exiting Command.DoThing | result: {\"some\":\"useful\",\"data\":\"which\",\"we\":\"need\",\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-18T14:41:51.861Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "context": "AspectLogger",
    "msg": "Exiting AppService.runCommand | result: {\"some\":\"useful\",\"data\":\"which\",\"we\":\"need\",\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-18T14:41:51.866Z",
    "pid": 26048,
    "hostname": "SLB-4PWL4Y2",
    "req": {
        "id": "65d49371-d47c-4170-8039-e273ce8f5d95",
        "method": "GET",
        "url": "/api/command",
        "query": {},
        "params": {
            "0": "api/command"
        },
        "headers": {
            "host": "localhost:3000",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53254
    },
    "res": {
        "statusCode": 200,
        "headers": {
            "x-powered-by": "Express",
            "x-request-id": "65d49371-d47c-4170-8039-e273ce8f5d95",
            "content-type": "application/json; charset=utf-8",
            "content-length": "86",
            "etag": "W/\"56-Px7oRE3ex14xXSLksTZp66ipZiY\""
        }
    },
    "responseTime": 12,
    "msg": "request completed",
    "severity": "INFO"
    }

```
