import {createStream} from '@binxhealth/pino-stackdriver';
import {Logger} from '@nestjs/common';
import {context, trace} from '@opentelemetry/api';
import {afterMethod, beforeMethod, Metadata, onThrowOfMethod} from 'aspect.js';
import {MethodSelector} from 'aspect.js/src/join_points';
import {LoggerModule} from 'nestjs-pino';

import Pino from 'pino';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traceableFormatter = (object: any): any => {
  const span = trace.getSpan(context.active());
  if (!span) return {...object};
  const {spanId, traceId, traceFlags} = trace
    .getSpan(context.active())
    ?.spanContext();
  return {...object, spanId, traceId, traceFlags};
};

const loggerOptions: Pino.LoggerOptions = {
  formatters: ['log', 'debug', 'error', 'warn'].reduce(
    (acc, method): Object => {
      acc[method] = traceableFormatter;
      return acc;
    },
    {}
  ),
  base: undefined, // Set to undefined to avoid adding pid, hostname properties to each log.
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers["x-api-key"]',
      'res.headers.etag',
    ],
    remove: true,
  },
};

const destination: Pino.DestinationStream = process.env.LOG_FILE_NAME
  ? Pino.destination(process.env.LOG_FILE_NAME)
  : undefined;
export const LoggerModuleConfig = LoggerModule.forRoot({
  pinoHttp: [
    {
      logger: Pino(loggerOptions, destination),
    },
    createStream(),
  ],
});


export class AspectLogger {
  private static readonly pattern: MethodSelector = {
    classNamePattern: /.*/,
    methodNamePattern: /.*/,
  };

  private static instance: Logger;
  private getInstance(): Logger {
    if (!AspectLogger.instance) {
      AspectLogger.instance = new Logger(AspectLogger.name);
      AspectLogger.instance.log('Constructing logger');
    }
    return AspectLogger.instance;
  }

  @beforeMethod(AspectLogger.pattern)
  before(meta: Metadata) {
    this.getInstance().log(
      `Entering ${meta.className}.${meta.method.name} | args: ${JSON.stringify(
        meta.method.args
      )}`
    );
  }

  @afterMethod(AspectLogger.pattern)
  after(meta: Metadata) {
    this.getInstance().log(
      `Exiting ${meta.className}.${meta.method.name} | result: ${JSON.stringify(
        meta.method.result
      )}`
    );
  }

  // Need to be careful using this aspect, this can silently catch errors for us,
  // so we must rethrow the error to resume expected bubbling of the error
  @onThrowOfMethod(AspectLogger.pattern)
  throw(meta: Metadata) {
    this.getInstance().error(
      `Throwing ${meta.className}.${meta.method.name} | error: ${JSON.stringify(
        meta.method.exception
      )}`
    );
    throw meta.method.exception;
  }
}
