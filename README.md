<p align="center">
  <img src="https://see.fontimg.com/api/renderfont4/K5mo/eyJyIjoiZnMiLCJoIjoyMDAsInciOjEwMDAsImZzIjoyMDAsImZnYyI6IiM0NEE5REEiLCJiZ2MiOiIjRkZGRkZGIiwidCI6MX0/VEhPVEg/paintingwithchocolate.png" alt="Tattoo fonts">
<p>

# Thoth

Aspectjs Contextual Logging POC

- [Thoth](#thoth)
  - [References](#references)
  - [Things to consider](#things-to-consider)
  - [Commands](#commands)
  - [Expected logs for api/command endpoint](#expected-logs-for-apicommand-endpoint)

## References

- NestJS Pino - Platform agnostic logger for NestJS based on Pino with REQUEST CONTEXT IN EVERY LOG - <https://github.com/iamolegga/nestjs-pino>
- AspectJS - Library for aspect-oriented programming with JavaScript, which takes advantage of ECMAScript 2016 decorators syntax - <https://github.com/mgechev/aspect.js>
- express-request-id - Generate UUID for request and add it to X-Request-Id header. In case request contains X-Request-Id header, uses its value instead - <https://www.npmjs.com/package/express-request-id>
- pino-stackdriver - A utility that makes express-pino logs StackDriver-compatible - <https://github.com/binxhealth/pino-stackdriver>
- nestjs-otel - OpenTelemetry module for Nest. - <https://github.com/pragmaticivan/nestjs-otel>
- Observability Whitepaper <https://github.com/cncf/tag-observability/blob/main/whitepaper.md>
- pino-http - High-speed HTTP logger for Node.js - <https://github.com/pinojs/pino-http#pinohttplogger-plogger>
  - logger options <https://github.com/pinojs/pino/blob/HEAD/docs/api.md#options>
  - redaction <https://github.com/pinojs/pino/blob/b48f63581d5d9fb70141632520e1a44d58f34758/docs/redaction.md#paths>
    - path syntax <https://github.com/pinojs/pino/blob/b48f63581d5d9fb70141632520e1a44d58f34758/docs/redaction.md#paths>

## Things to consider

- [x] How to redact senetive and secret request / response data such as Authorization tokens or api keys
- [x] How to point open telemetry to correct observability stack
- [x] how to log spanid and traceid in logs
- [ ] Are we performing semantic logging properly?
- [ ] Determine the correct attributes to log

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
npm run test:e2e

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

# Visualise request tracing through whole application
curl -H "X-Request-Id: your-x-request-id" localhost:3000/api/command
# {"some":"useful","data":"which","we":"need","something":"that","I":"need","To":"Find"}

# Trigger an error that is caught and logged internally
curl -H "X-Request-Id: your-x-request-id" localhost:3000/api/throw
```

if no X-Request-Id is provided this service will generate one to be available in the response headers (see below for details)

## Expected logs for api/command endpoint

```JSON
// curl -H "Authorization: some-key" -H "x-api-key: asdasdfasd" http://localhost:3000/api/command
// {"some":"useful","data":"which","we":"need","something":"that","I":"need","To":"Find"}
{
    // pid and hostname are removed in this example
    "level": 30,
    "time": "2021-10-20T10:19:06.172Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3", // <- x-request-id generated
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
            // Authorizaton and X-API-Key headers are removed
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f", // Open telemetry spanId generated
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e", // Open telemetry traceId generated
    "msg": "Constructing logger",
    "severity": "INFO" // <- Stackdriver compatible severity is logged
}
{
    "level": 30,
    "time": "2021-10-20T10:19:06.173Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "Entering AppService.runCommand | args: []",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-20T10:19:06.175Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "Entering Command.DoThing | args: [{\"data\":\"Complex query string\",\"attributes\":{\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}}]",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-20T10:19:06.175Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "Entering Repository.Get | args: [{\"data\":\"Complex query string\",\"attributes\":{\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}}]",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-20T10:19:06.176Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "Entering DataAccess.Get | args: [\"Complex query string\",{\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}]",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-20T10:19:06.177Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "Using Complex query string to make a query",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-20T10:19:06.178Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "Exiting DataAccess.Get | result: {\"some\":\"useful\",\"data\":\"which\",\"we\":\"need\",\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-20T10:19:06.178Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "Exiting Repository.Get | result: {\"some\":\"useful\",\"data\":\"which\",\"we\":\"need\",\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-20T10:19:06.179Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "Exiting Command.DoThing | result: {\"some\":\"useful\",\"data\":\"which\",\"we\":\"need\",\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}",
    "severity": "INFO"
}
{
    "level": 30,
    "time": "2021-10-20T10:19:06.180Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "Exiting AppService.runCommand | result: {\"some\":\"useful\",\"data\":\"which\",\"we\":\"need\",\"something\":\"that\",\"I\":\"need\",\"To\":\"Find\"}",
    "severity": "INFO"
}    
{
    "level": 30,
    "time": "2021-10-20T10:19:06.185Z",
    "req": {
        "id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
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
        "remotePort": 53166
    },
    "res": {
        "statusCode": 200,
        "headers": {
            "x-powered-by": "Express",
            "x-request-id": "7f04f222-e64e-4604-8c5b-93e5561adde3",
            "content-type": "application/json; charset=utf-8",
            "content-length": "86"
        }
    },
    "responseTime": 14,
    "spanId": "568cfba86549be3f",
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e",
    "msg": "request completed",
    "severity": "INFO"
}
```
