import {HttpModule} from '@nestjs/axios';
import {Logger, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {context, trace} from '@opentelemetry/api';
import * as addRequestIdMiddleware from 'express-request-id';
import {ClientAPI, Command, DataAccess, Repository} from '../domain';
import {
  RequestLoggerModule,
  TracingModule,
  RequestContextMiddleware,
  RequestContextModule,
  AspectModule,
} from '../infrastructure';
import {AppController} from './app.controller';
import {AppService} from './app.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logFormatter = (object: any): any => {
  const span = trace.getSpan(context.active());
  if (!span) return {...object};
  const {spanId, traceId, traceFlags} = trace
    .getSpan(context.active())
    ?.spanContext();
  return {
    ...object,
    spanId,
    traceId,
    traceFlags,
  };
};

@Module({
  imports: [
    TracingModule.forRoot({interval: 1000}),

    RequestLoggerModule.forRoot({
      formatter: logFormatter, // Monkey patch in log formatter
      redactPaths: [
        'req.headers.authorization',
        'req.headers["x-api-key"]',
        'res.headers.etag',
      ],
      logPath: process.env.LOG_FILE_NAME,
    }),

    AspectModule.forRoot({logger: new Logger('ASPECT LOGGER')}),

    RequestContextModule,

    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, Command, Repository, DataAccess, ClientAPI, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // here addRequestIdMiddleware must be before RequestContextMiddleware to allow
      // extraction of a generated request id via the context middleware
      .apply(addRequestIdMiddleware(), RequestContextMiddleware)
      .forRoutes(AppController);
  }
}
