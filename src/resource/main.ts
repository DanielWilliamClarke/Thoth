import {NestFactory} from '@nestjs/core';
import {Logger} from 'nestjs-pino';
import {AppModule} from './app.module';

import * as addRequestIdMiddleware from 'express-request-id';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bufferLogs: true});
  app.useLogger(app.get(Logger));
  app.use(addRequestIdMiddleware());
  await app.listen(3000);
}
bootstrap();
