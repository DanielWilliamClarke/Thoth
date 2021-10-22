import {DynamicModule, Module} from '@nestjs/common';
import {LoggerModule} from 'nestjs-pino';

import * as fs from 'fs';

import pino from 'pino';

type LoggerModuleOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter: (object: any) => any;
  redactPaths: string[];
  logPath: string;
  addSeverity: boolean;
};

const logLevels = ['log', 'debug', 'error', 'warn'];

const SeverityLookup = {
  default: 'DEFAULT',
  silly: 'DEFAULT',
  verbose: 'DEBUG',
  debug: 'DEBUG',
  http: 'notice',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
};

const createLoggerOptions = (options: LoggerModuleOptions) => {
  const logFormatters = logLevels.reduce(
    (acc, method): Object => ({
      ...acc,
      [method]: options.formatter,
    }),
    {}
  );

  const levelFormatters = {
    level: (label: string, number: number) => {
      const log = {level: number};
      if (!options.addSeverity) {
        return log;
      }

      return {
        severity: SeverityLookup[label] || SeverityLookup['info'],
        ...log,
      };
    },
  };

  return {
    formatters: {
      ...logFormatters,
      ...levelFormatters,
    },
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
              logger: pino(
                createLoggerOptions(options),
                options.logPath
                  ? pino.destination(options.logPath)
                  : process.stdout
              ),
            },
          ],
        }),
      ],
    };
  }
}
