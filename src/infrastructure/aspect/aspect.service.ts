import {Injectable} from '@nestjs/common';
import {afterMethod, beforeMethod, Metadata, onThrowOfMethod} from 'aspect.js';
import {MethodSelector} from 'aspect.js/src/join_points';

export interface ILogger {
  log(string): void;
  error(string): void;
  debug(string): void;
  warn(string): void;
}

@Injectable()
export class AspectLoggerService {
  private static readonly pattern: MethodSelector = {
    classNamePattern: /.*/,
    methodNamePattern: /.*/,
  };

  public static instance: ILogger;
  static get logger(): ILogger {
    return this.instance;
  }
  static set logger(l: ILogger) {
    this.instance = l;
  }

  @beforeMethod(AspectLoggerService.pattern)
  before(meta: Metadata) {
    AspectLoggerService.logger.log(
      `Entering ${meta.className}.${meta.method.name} | args: ${JSON.stringify(
        meta.method.args
      )}`
    );
  }

  @afterMethod(AspectLoggerService.pattern)
  after(meta: Metadata) {
    AspectLoggerService.logger.log(
      `Exiting ${meta.className}.${meta.method.name} | result: ${JSON.stringify(
        meta.method.result
      )}`
    );
  }

  // Need to be careful using this aspect, this can silently catch errors for us,
  // so we must rethrow the error to resume expected bubbling of the error
  @onThrowOfMethod(AspectLoggerService.pattern)
  throw(meta: Metadata) {
    AspectLoggerService.logger.error(
      `Throwing ${meta.className}.${meta.method.name} | error: ${JSON.stringify(
        meta.method.exception
      )}`
    );
    throw meta.method.exception;
  }
}
