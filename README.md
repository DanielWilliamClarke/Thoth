<p align="center">
  <img src="https://see.fontimg.com/api/renderfont4/K5mo/eyJyIjoiZnMiLCJoIjoyMDAsInciOjEwMDAsImZzIjoyMDAsImZnYyI6IiM0NEE5REEiLCJiZ2MiOiIjRkZGRkZGIiwidCI6MX0/VEhPVEg/paintingwithchocolate.png" alt="Tattoo fonts">
<p>

# 🏜️ Thoth

Contextual Logging POC

- [🏜️ Thoth](#️-thoth)
  - [Main Deliverables](#main-deliverables)
  - [Provided Infrastructure](#provided-infrastructure)
  - [Things to consider](#things-to-consider)
  - [References](#references)
  - [Service Build and Test](#service-build-and-test)
  - [Generating Traffic](#generating-traffic)
    - [Curl](#curl)
    - [Postman](#postman)
  - [Observability Stack](#observability-stack)
    - [Grafana](#grafana)
      - [Exploring for traces](#exploring-for-traces)
      - [Exploring for logs](#exploring-for-logs)
  - [Expected logs for api/command endpoint](#expected-logs-for-apicommand-endpoint)
  - [Extraction and pass through of X-Request-Id](#extraction-and-pass-through-of-x-request-id)

## Main Deliverables

This project culminates in the amalgamation of 4 technologies:

- **AspectJS** <https://github.com/mgechev/aspect.js>
- **NestJS-Pino** <https://github.com/iamolegga/nestjs-pino>
- **Opentelemetry** <https://github.com/pragmaticivan/nestjs-otel>
- **AsyncLocalStorage** <https://nodejs.org/api/async_context.html#async_context_new_asynclocalstorage>

To realise 4 drop in modules:

- `AspectModule` - Providing non intrusive application logging
- `RequestLoggingModule` - Providing JSON formatted logging containing request context in every log
- `TracingModule` - Providing opentelemetry based request tracing and log forwarding to the Observability stack
- `RequestContextModule` - Providing request and response interception middleware and services to allow access to the mainline request context at any level of the application

In this application these drop in modules can be turned off via the flags present in the `AppOptions` object required by the `AppModule`

## Provided Infrastructure

- **Thoth Service**
  - <http://localhost:5555/api> - Hello World!
  - <http://localhost:5555/api/command> - returns JSON
  - <http://localhost:5555/api/throw> - Internally throws and error and catches it
  - <http://localhost:5555/api/passthru> - Internally calls root endpoint to demonstrate request context access
- **Grafana** - Open source analytics & monitoring solution for every database. - <https://grafana.com/>
  - <http://localhost:3000>
- **Prometheus** - Monitoring and time series database - <https://prometheus.io/>
  - <http://localhost:9090>
- **Loki** - Log aggregator -  <https://grafana.com/oss/loki/>
  - <http://localhost:3101>
  - <http://loki:3100> inside docker network

## Things to consider

- [x] How to redact sensitive and secret request / response data such as Authorization tokens or api keys
- [x] How to point open telemetry to correct observability stack
- [x] how to log spanId and traceId in logs
- [x] Access request context cleanly outside of `AppController`
- [x] Need to ensure our usage of AsyncLocalStorage is thread safe
- [x] Logs have StackDriver compatible attributes
- [ ] Are we performing semantic logging properly?
- [ ] Determine the correct attributes to log

## References

- **NestJS Pino** - Platform agnostic logger for NestJS based on Pino with REQUEST CONTEXT IN EVERY LOG - <https://github.com/iamolegga/nestjs-pino>
- **AspectJS** - Library for aspect-oriented programming with JavaScript, which takes advantage of ECMAScript 2016 decorators syntax - <https://github.com/mgechev/aspect.js>
- **express-request-id** - Generate UUID for request and add it to X-Request-Id header. In case request contains X-Request-Id header, uses its value instead - <https://www.npmjs.com/package/express-request-id>
- **nestjs-otel** - OpenTelemetry module for Nest. - <https://github.com/pragmaticivan/nestjs-otel>
- **Observability** Whitepaper <https://github.com/cncf/tag-observability/blob/main/whitepaper.md>
- **pino-http** - High-speed HTTP logger for Node.js - <https://github.com/pinojs/pino-http#pinohttplogger-plogger>
  - logger options <https://github.com/pinojs/pino/blob/HEAD/docs/api.md#options>
  - redaction <https://github.com/pinojs/pino/blob/b48f63581d5d9fb70141632520e1a44d58f34758/docs/redaction.md#paths>
    - path syntax <https://github.com/pinojs/pino/blob/b48f63581d5d9fb70141632520e1a44d58f34758/docs/redaction.md#paths>
- **AsyncLocalStorage** - Each instance of AsyncLocalStorage maintains an independent storage context. Multiple instances can safely exist simultaneously without risk of interfering with each other data. - <https://nodejs.org/api/async_context.html#async_context_new_asynclocalstorage>
  - Request Context Middleware based on <https://gist.github.com/bengry/924a9b93c25d8a98bffdfc0a847f0dbe>
- **Grafana Tempo** - Docker Compose example used to build the working Observability Stack
  - https://github.com/grafana/tempo/tree/main/example/docker-compose
  - https://github.com/grafana/tempo/blob/main/example/docker-compose/loki/readme.md

## Service Build and Test

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

## Generating Traffic

### Curl

Once the service is running you can make requests to it with curl

```Bash
curl -v -H "X-Request-Id: your-x-request-id" localhost:5555/api/
# *   Trying 127.0.0.1:5555...
# * TCP_NODELAY set
# * Connected to localhost (127.0.0.1) port 5555 (#0)
# > GET /api HTTP/1.1
# > Host: localhost:5555
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
curl -H "X-Request-Id: your-x-request-id" localhost:5555/api/command
# {"some":"useful","data":"which","we":"need","something":"that","I":"need","To":"Find"}

# Trigger an error that is caught and logged internally
curl -H "X-Request-Id: your-x-request-id" localhost:5555/api/throw

# Internally /api is called and its response is returned
curl -H "X-Request-Id: your-x-request-id" localhost:5555/api/passthru
# Hello World!
```

if no X-Request-Id is provided this service will generate one to be available in the response headers (see below for details)

### Postman

- You can import the provided postman collection and environment into postman to facilitate generating substantial traffic against the Thoth service, as well as to validate expected behavior and `x-request-id` header pass through / generation
- See `/e2e` and <https://learning.postman.com/docs/getting-started/importing-and-exporting-data/> for details

## Observability Stack

You can start the `Prometheus` + `Grafana` + `Tempo` + `Loki` Observability Stack and visualize logs by running

```bash
# On initial run
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions

# Every time
docker-compose up --build
```

this will build the `Thoth` service and then deploy it along with the `Prometheus`, `Grafana`, `Tempo` and `Loki`
  
1. Navigate to <http://localhost:3000> to open `Grafana`

### Grafana

> Grafana is initially configured to connect Loki and Tempo together and prepare tracing and logging visualization.
> You can just open Grafana and start querying data sources.
>
> However you can use the below to set up custom data sources:

1. Open `Settings`
2. Add data source and search for the data source to add
3. Follow the setup screen and ensure the data source setup is successful

#### Exploring for traces

1. Open `Explore`
2. Using the top level dropdown set the Datasource to `Tempo` (if it is no already selected)
3. Select the `Search` query type and then click `Log Browser`
4. You can then find the `Thoth` logs in the list
5. Hit `Run Query`

You should then be able to see and explore traces generated by the Thoth service. Clicking on a particular trace ID will make the trace visible in a tracing panel.

![Tracing Example](/assets/grafana_1.png "Grafana Tracing")

#### Exploring for logs

1. Open `Explore`
1. Using the top level dropdown set the Datasource to `Loki`
3. Select the `Search` query type and then click `Log Browser`
4. You can then find the `Thoth` logs in the list
5. Hit `Run Query`
6. You can hit `Live` and see logs in real time
7. Clicking on a log will display its contents, you can then jump directly to its related trace by clicking on the `Tempo` button attached to the `TraceID` field

> `Thoth` logs are printed to **`stdout`** and **`stderr`**, when `Thoth` is run within the Observability stack the **`Grafana Loki Driver`** installed will funnel all console logs to `Loki` for ingestion

![Logging Example](/assets/grafana_2.png "Grafana Logging")

## Expected logs for api/command endpoint

```JSON
// curl -H "Authorization: some-key" -H "x-api-key: aaaaaaaaaaaa" http://localhost:5555/api/command
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
            "host": "localhost:5555",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
            // Authorization and X-API-Key headers are removed
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 53166
    },
    "context": "AspectLogger",
    "spanId": "568cfba86549be3f", // Open telemetry spanId generated
    "traceId": "42af2ee285a0df44567ca7227c9fcb5e", // Open telemetry traceId generated
    "msg": "Constructing logger",
    "severity": "INFO" // <- StackDriver compatible severity is logged
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
            "host": "localhost:5555",
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
            "host": "localhost:5555",
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
            "host": "localhost:5555",
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
            "host": "localhost:5555",
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
            "host": "localhost:5555",
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
            "host": "localhost:5555",
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
            "host": "localhost:5555",
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
            "host": "localhost:5555",
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
            "host": "localhost:5555",
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
            "host": "localhost:5555",
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

## Extraction and pass through of X-Request-Id 

Calling `localhost:5555/api/passthru` will make a call to `localhost:5555/api`, the aim of this is to demonstrate that we can access the mainline request context outside of the `AppController`, without having to push parameters and arguments through the code to their required destinations.

Below is the log output of the `passthru` endpoint, you will see that the `req.id` and the `X-Request-Id` header are passed to the subsequent API call correctly.

```JSON
// curl localhost:5555/api/passthru
// Hello World!
{
    "level": 30,
    "time": 1634809427005,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8", // <- Request id generated here
        "method": "GET",
        "url": "/api/passthru",
        "query": {},
        "params": {
            "0": "api/passthru"
        },
        "headers": {
            "host": "localhost:5555",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56644
    },
    "context": "AspectLogger",
    "spanId": "1883af6dbd054293",
    "traceId": "013cdb493be0f90fb478331d4a8d458a",
    "traceFlags": 1,
    "msg": "Constructing logger"
}
{
    "level": 30,
    "time": 1634809427006,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
        "method": "GET",
        "url": "/api/passthru",
        "query": {},
        "params": {
            "0": "api/passthru"
        },
        "headers": {
            "host": "localhost:5555",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56644
    },
    "context": "AspectLogger",
    "spanId": "1883af6dbd054293",
    "traceId": "013cdb493be0f90fb478331d4a8d458a",
    "traceFlags": 1,
    "msg": "Entering AppService.passthru | args: []"
}
{
    "level": 30,
    "time": 1634809427008,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
        "method": "GET",
        "url": "/api/passthru",
        "query": {},
        "params": {
            "0": "api/passthru"
        },
        "headers": {
            "host": "localhost:5555",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56644
    },
    "context": "AspectLogger",
    "spanId": "1883af6dbd054293",
    "traceId": "013cdb493be0f90fb478331d4a8d458a",
    "traceFlags": 1,
    "msg": "Entering ClientAPI.Get | args: []"
}
{
    "level": 30,
    "time": 1634809427008,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
        "method": "GET",
        "url": "/api/passthru",
        "query": {},
        "params": {
            "0": "api/passthru"
        },
        "headers": {
            "host": "localhost:5555",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56644
    },
    "spanId": "1883af6dbd054293",
    "traceId": "013cdb493be0f90fb478331d4a8d458a",
    "traceFlags": 1,
    "msg": "calling /api on self"
}
{
    "level": 30,
    "time": 1634809427015,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
        "method": "GET",
        "url": "/api/passthru",
        "query": {},
        "params": {
            "0": "api/passthru"
        },
        "headers": {
            "host": "localhost:5555",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56644
    },
    "context": "AspectLogger",
    "spanId": "1883af6dbd054293",
    "traceId": "013cdb493be0f90fb478331d4a8d458a",
    "traceFlags": 1,
    "msg": "Exiting ClientAPI.Get | result: {}"
}
{
    "level": 30,
    "time": 1634809427015,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
        "method": "GET",
        "url": "/api/passthru",
        "query": {},
        "params": {
            "0": "api/passthru"
        },
        "headers": {
            "host": "localhost:5555",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56644
    },
    "context": "AspectLogger",
    "spanId": "1883af6dbd054293",
    "traceId": "013cdb493be0f90fb478331d4a8d458a", // <- Trace id generated via opentelemetry
    "traceFlags": 1,
    "msg": "Exiting AppService.passthru | result: {}"
}
{ // <- Call to /api here
    "level": 30,
    "time": 1634809427020,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8", // <- Request id from parent API call is present here in the child call
        "method": "GET",
        "url": "/api",
        "query": {},
        "params": {
            "0": "api"
        },
        "headers": {
            "accept": "application/json, text/plain, */*",
            "x-request-id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
            "user-agent": "axios/0.23.0",
            "uber-trace-id": "013cdb493be0f90fb478331d4a8d458a:66185639357e4490:0:01",
            "traceparent": "00-013cdb493be0f90fb478331d4a8d458a-66185639357e4490-01",
            "b3": "013cdb493be0f90fb478331d4a8d458a-66185639357e4490-1",
            "x-b3-traceid": "013cdb493be0f90fb478331d4a8d458a", // <- Same Trace id is present here in child call
            "x-b3-spanid": "66185639357e4490",
            "x-b3-sampled": "1",
            "host": "localhost:5555",
            "connection": "close"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56645
    },
    "context": "AspectLogger",
    "spanId": "ac55c5fe5b0fcf84",
    "traceId": "013cdb493be0f90fb478331d4a8d458a",
    "traceFlags": 1,
    "msg": "Entering AppService.getHello | args: []"
}
{
    "level": 30,
    "time": 1634809427021,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
        "method": "GET",
        "url": "/api",
        "query": {},
        "params": {
            "0": "api"
        },
        "headers": {
            "accept": "application/json, text/plain, */*",
            "x-request-id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
            "user-agent": "axios/0.23.0",
            "uber-trace-id": "013cdb493be0f90fb478331d4a8d458a:66185639357e4490:0:01",
            "traceparent": "00-013cdb493be0f90fb478331d4a8d458a-66185639357e4490-01",
            "b3": "013cdb493be0f90fb478331d4a8d458a-66185639357e4490-1",
            "x-b3-traceid": "013cdb493be0f90fb478331d4a8d458a",
            "x-b3-spanid": "66185639357e4490",
            "x-b3-sampled": "1",
            "host": "localhost:5555",
            "connection": "close"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56645
    },
    "context": "AspectLogger",
    "spanId": "ac55c5fe5b0fcf84",
    "traceId": "013cdb493be0f90fb478331d4a8d458a",
    "traceFlags": 1,
    "msg": "Exiting AppService.getHello | result: \"Hello World!\""
}
{
    "level": 30,
    "time": 1634809427026,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
        "method": "GET",
        "url": "/api",
        "query": {},
        "params": {
            "0": "api"
        },
        "headers": {
            "accept": "application/json, text/plain, */*",
            "x-request-id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
            "user-agent": "axios/0.23.0",
            "uber-trace-id": "013cdb493be0f90fb478331d4a8d458a:66185639357e4490:0:01",
            "traceparent": "00-013cdb493be0f90fb478331d4a8d458a-66185639357e4490-01",
            "b3": "013cdb493be0f90fb478331d4a8d458a-66185639357e4490-1",
            "x-b3-traceid": "013cdb493be0f90fb478331d4a8d458a",
            "x-b3-spanid": "66185639357e4490",
            "x-b3-sampled": "1",
            "host": "localhost:5555",
            "connection": "close"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56645
    },
    "res": {
        "statusCode": 200,
        "headers": {
            "x-powered-by": "Express",
            "x-request-id": "9aeda399-0719-4eed-b258-c5c13348e9a8", // <- Request id present in res headers of child call
            "content-type": "text/html; charset=utf-8",
            "content-length": "12"
        }
    },
    "responseTime": 7,
    "spanId": "ac55c5fe5b0fcf84",
    "traceId": "013cdb493be0f90fb478331d4a8d458a",
    "traceFlags": 1,
    "msg": "request completed"
}
{
    "level": 30,
    "time": 1634809427031,
    "req": {
        "id": "9aeda399-0719-4eed-b258-c5c13348e9a8",
        "method": "GET",
        "url": "/api/passthru",
        "query": {},
        "params": {
            "0": "api/passthru"
        },
        "headers": {
            "host": "localhost:5555",
            "user-agent": "curl/7.67.0",
            "accept": "*/*"
        },
        "remoteAddress": "::ffff:127.0.0.1",
        "remotePort": 56644
    },
    "res": {
        "statusCode": 200,
        "headers": {
            "x-powered-by": "Express",
            "x-request-id": "9aeda399-0719-4eed-b258-c5c13348e9a8",  // <- Same Request id present in res headers of parent call
            "content-type": "text/html; charset=utf-8",
            "content-length": "12"
        }
    },
    "responseTime": 27,
    "spanId": "1883af6dbd054293",
    "traceId": "013cdb493be0f90fb478331d4a8d458a",
    "traceFlags": 1,
    "msg": "request completed"
}
```
