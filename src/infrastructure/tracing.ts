
import {getNodeAutoInstrumentations} from '@opentelemetry/auto-instrumentations-node';
import {AsyncLocalStorageContextManager} from '@opentelemetry/context-async-hooks';
import {
  CompositePropagator,
  HttpBaggagePropagator,
  HttpTraceContextPropagator,
} from '@opentelemetry/core';
import {JaegerExporter} from '@opentelemetry/exporter-jaeger';
import {PrometheusExporter} from '@opentelemetry/exporter-prometheus';
import {B3InjectEncoding, B3Propagator} from '@opentelemetry/propagator-b3';
import {JaegerPropagator} from '@opentelemetry/propagator-jaeger';
import {NodeSDK} from '@opentelemetry/sdk-node';
import {BatchSpanProcessor} from '@opentelemetry/tracing';
import {OpenTelemetryModule} from 'nestjs-otel';
import * as process from 'process';

export const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true, // Includes Host Metrics
    defaultMetrics: true, // Includes Default Metrics
    apiMetrics: {
      enable: true, // Includes api metrics
      timeBuckets: [], // You can change the default time buckets
      defaultLabels: {
        // You can set default labels for api metrics
        custom: 'label',
      },
      ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
      ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
    },
  },
});

export class Tracer {
  private static instance: NodeSDK;
  public static getInstance(): NodeSDK {
    if (!Tracer.instance) {
      Tracer.instance = Tracer.build();
    }
    return Tracer.instance;
  }

  private static build(): NodeSDK {
    return new NodeSDK({
      metricExporter: new PrometheusExporter({
        port: 8081,
      }),
      metricInterval: 1000,
      spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
      contextManager: new AsyncLocalStorageContextManager(),
      textMapPropagator: new CompositePropagator({
        propagators: [
          new JaegerPropagator(),
          new HttpTraceContextPropagator(),
          new HttpBaggagePropagator(),
          new B3Propagator(),
          new B3Propagator({
            injectEncoding: B3InjectEncoding.MULTI_HEADER,
          }),
        ],
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });
  }
}

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
process.on('SIGTERM', () => {
  Tracer.getInstance()
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      err => console.log('Error shutting down SDK', err)
    )
    // eslint-disable-next-line no-process-exit
    .finally(() => process.exit(0));
});
