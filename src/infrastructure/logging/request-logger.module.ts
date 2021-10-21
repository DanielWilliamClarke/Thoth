import {DynamicModule, Module} from '@nestjs/common';
import {createStream} from '@binxhealth/pino-stackdriver';
import {LoggerModule} from 'nestjs-pino';

import Pino from 'pino';

type LoggerModuleOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter: (object: any) => any;
  redactPaths: string[];
  logPath: string;
};

const createLoggerOptions = (options: LoggerModuleOptions) => {
  return {
    formatters: ['log', 'debug', 'error', 'warn'].reduce(
      (acc, method): Object => {
        acc[method] = options.formatter;
        return acc;
      },
      {}
    ),
    base: undefined,
    redact: {
      paths: options.redactPaths,
      remove: true,
    },
  };
};

@Module({})
export class RequestLoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: RequestLoggerModule,
      imports: [
        LoggerModule.forRoot({
          pinoHttp: [
            {
              logger: Pino(
                createLoggerOptions(options),
                options.logPath ? Pino.destination(options.logPath) : undefined
              ),
            },
            createStream(),
          ],
        }),
      ]
    };
  }
}
