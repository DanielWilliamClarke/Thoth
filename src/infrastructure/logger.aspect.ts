import {afterMethod, beforeMethod, Metadata} from 'aspect.js';
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
}
