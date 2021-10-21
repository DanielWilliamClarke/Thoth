import {NestFactory} from '@nestjs/core';
import {Logger} from 'nestjs-pino';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule.forRoot({
      runTracer: true,
      runLogger: true,
      runAspect: true,
    }),
    {bufferLogs: true}
  );
  app.useLogger(app.get(Logger));

  await app.listen(5555);
}
bootstrap();
