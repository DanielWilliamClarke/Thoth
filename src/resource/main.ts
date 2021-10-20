import {NestFactory} from '@nestjs/core';
import * as addRequestIdMiddleware from 'express-request-id';
import {Logger} from 'nestjs-pino';

import {Tracer} from '../infrastructure';
import {AppModule} from './app.module';

import '../infrastructure';

async function bootstrap() {
  await Tracer.getInstance().start();

  const app = await NestFactory.create(AppModule, {bufferLogs: true});
  app.useLogger(app.get(Logger));
  app.use(addRequestIdMiddleware());
  await app.listen(3000);
}
bootstrap();
