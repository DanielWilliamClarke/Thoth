import { DynamicModule, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import * as addRequestIdMiddleware from 'express-request-id';

import { DomainModule } from '../domain';
import { AspectModule, RequestContextMiddleware, RequestLoggerModule, TracingModule } from '../infrastructure';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logFormatter = (object: any): any => {
  const span = trace.getSpan(context.active());
  if (!span) return {...object};

  const {spanId, traceId, traceFlags} = trace
    .getSpan(context.active())
    ?.spanContext();

  return {
    ...object,
    spanID: spanId,
    traceID: traceId,
    traceFlags,
  };
};

type AppOptions = {
  runTracer: boolean;
  runLogger: boolean;
  runAspect: boolean;
};

@Module({})
export class AppModule implements NestModule {
  static forRoot(options: AppOptions): DynamicModule {
    const imports = [];

    if (options.runTracer) {
      imports.push(
        TracingModule.forRoot({
          metricsInterval: 1000,
          metricsPort: 9090,
        })
      );
    }
    if (options.runLogger) {
      imports.push(
        RequestLoggerModule.forRoot({
          formatter: logFormatter, // Monkey patch in log formatter
          addSeverity: true,
          redactPaths: [
            'req.headers.authorization',
            'req.headers["x-api-key"]',
            'res.headers.etag',
          ],
        })
      );
    }
    if (options.runAspect) {
      imports.push(AspectModule.forRoot({logger: new Logger('ASPECT LOGGER')}));
    }

    return {
      module: AppModule,
      imports: [...imports, DomainModule],
      controllers: [AppController],
      providers: [AppService, Logger],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      // here addRequestIdMiddleware must be before RequestContextMiddleware to allow
      // extraction of a generated request id via the context middleware
      .apply(addRequestIdMiddleware(), RequestContextMiddleware)
      .forRoutes(AppController);
  }
}
