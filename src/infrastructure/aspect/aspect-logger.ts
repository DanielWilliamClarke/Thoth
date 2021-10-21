import {afterMethod, beforeMethod, Metadata, onThrowOfMethod} from 'aspect.js';
import {MethodSelector} from 'aspect.js/src/join_points';

export interface ILogger {
  log(string): void;
  error(string): void;
  debug(string): void;
  warn(string): void;
}

const noop = () => {};

export class AspectLogger {
  private static readonly pattern: MethodSelector = {
    classNamePattern: /.*/,
    methodNamePattern: /.*/,
  };

  private static instance: ILogger = {
    log: noop,
    error: noop,
    debug: noop,
    warn: noop,
  };

  static get logger(): ILogger {
    return this.instance;
  }
  static set logger(l: ILogger) {
    this.instance = l;
  }

  @beforeMethod(AspectLogger.pattern)
  before(meta: Metadata) {
    AspectLogger.logger.log(
      `Entering ${meta.className}.${meta.method.name} | args: ${JSON.stringify(
        meta.method.args
      )}`
    );
  }

  @afterMethod(AspectLogger.pattern)
  after(meta: Metadata) {
    AspectLogger.logger.log(
      `Exiting ${meta.className}.${meta.method.name} | result: ${JSON.stringify(
        meta.method.result
      )}`
    );
  }

  // Need to be careful using this aspect, this can silently catch errors for us,
  // so we must rethrow the error to resume expected bubbling of the error
  @onThrowOfMethod(AspectLogger.pattern)
  throw(meta: Metadata) {
    AspectLogger.logger.error(
      `Throwing ${meta.className}.${meta.method.name} | error: ${JSON.stringify(
        meta.method.exception
      )}`
    );
    throw meta.method.exception;
  }
}
