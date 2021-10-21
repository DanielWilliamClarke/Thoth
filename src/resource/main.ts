import {NestFactory} from '@nestjs/core';
import {Logger} from 'nestjs-pino';
import {Tracer} from '../infrastructure';
import {AppModule} from './app.module';

import '../infrastructure';


async function bootstrap() {
  await Tracer.getInstance().start();

  const app = await NestFactory.create(AppModule, {bufferLogs: true});
  app.useLogger(app.get(Logger));

  await app.listen(5555);
}
bootstrap();
