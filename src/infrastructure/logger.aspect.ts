import {beforeMethod, Metadata} from 'aspect.js';
import {Logger} from '@nestjs/common';

export class AspectLogger {
  @beforeMethod({
    classNamePattern: /.*/,
    methodNamePattern: /.*/,
  })
  invokeBeforeMethod(meta: Metadata) {
    new Logger(AspectLogger.name).log(
      `Inside of the logger. Called ${meta.className}.${
        meta.method.name
      } with args: ${JSON.stringify(meta.method.args)}.`
    );
  }
}
