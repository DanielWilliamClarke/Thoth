import {afterMethod, beforeMethod, Metadata, onThrowOfMethod} from 'aspect.js';
import {Logger} from '@nestjs/common';
import {MethodSelector} from 'aspect.js/src/join_points';

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
