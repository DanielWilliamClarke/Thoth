import {HttpModule} from '@nestjs/axios';
import {Logger, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import * as addRequestIdMiddleware from 'express-request-id';
import {ClientAPI, Command, DataAccess, Repository} from '../domain';
import {
  LoggerModuleConfig,
  OpenTelemetryModuleConfig,
  RequestContextMiddleware,
  RequestContextModule,
} from '../infrastructure';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [
    OpenTelemetryModuleConfig,
    LoggerModuleConfig,
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
