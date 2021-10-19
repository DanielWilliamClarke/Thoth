import { NestFactory } from '@nestjs/core';
import * as addRequestIdMiddleware from 'express-request-id';
import { Logger } from 'nestjs-pino';

import otelSDK from '../infrastructure/tracing';
import { AppModule } from './app.module';

async function bootstrap() {
  await otelSDK.start();

  const app = await NestFactory.create(AppModule, {bufferLogs: true});
  app.useLogger(app.get(Logger));
  app.use(addRequestIdMiddleware());
  await app.listen(3000);
}
bootstrap();
