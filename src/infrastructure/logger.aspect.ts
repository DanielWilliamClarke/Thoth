import {beforeMethod, Metadata} from 'aspect.js';
import {Logger} from '@nestjs/common';

export class AspectLogger {
  private static instance: Logger;
  private getInstance(): Logger {
    if (!AspectLogger.instance) {
      console.log('Constructing logger');
      AspectLogger.instance = new Logger(AspectLogger.name);
    }
    return AspectLogger.instance;
  }

  @beforeMethod({
    classNamePattern: /.*/,
    methodNamePattern: /.*/,
  })
  invokeBeforeMethod(meta: Metadata) {
    this.getInstance().log(
      `Inside of the logger. Called ${meta.className}.${
        meta.method.name
      } with args: ${JSON.stringify(meta.method.args)}.`
    );
  }
}
