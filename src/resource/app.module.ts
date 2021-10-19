import { createStream } from '@binxhealth/pino-stackdriver';
import { Logger, Module } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { LoggerModule } from 'nestjs-pino';

import { Command, DataAccess, Repository } from '../domain';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true, // Includes Host Metrics
    defaultMetrics: true, // Includes Default Metrics
    apiMetrics: {
      enable: true, // Includes api metrics
      timeBuckets: [], // You can change the default time buckets
      defaultLabels: { // You can set default labels for api metrics
        custom: 'label'
      },
      ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
      ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
    },
  },
});

const LoggerModuleConfig = LoggerModule.forRoot({
  pinoHttp: [{}, createStream()],
});

@Module({
  imports: [
    OpenTelemetryModuleConfig,
    LoggerModuleConfig,
  ],
  controllers: [AppController],
  providers: [AppService, Command, Repository, DataAccess, Logger],
})
export class AppModule {}
