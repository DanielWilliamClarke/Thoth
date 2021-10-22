import {NestFactory} from '@nestjs/core';
import {Logger} from 'nestjs-pino';
import {AppModule} from './app.module';

async function bootstrap() {
  const appOptions = {
    runTracer: true,
    runLogger: true,
    runAspect: true,
  };

  const app = await NestFactory.create(AppModule.forRoot(appOptions), {
    bufferLogs: true,
  });

  if (appOptions.runLogger) {
    app.useLogger(app.get(Logger));
  }

  await app.listen(5555);
}
bootstrap();
