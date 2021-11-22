import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { CompositePropagator, HttpBaggagePropagator, HttpTraceContextPropagator } from '@opentelemetry/core';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/tracing';

export type TracerOptions = {
  metricsInterval: number;
  metricsPort: number;
};

export class Tracer {
  public static build(options: TracerOptions): NodeSDK {
    return new NodeSDK({
      metricExporter: new PrometheusExporter({
        port: options.metricsPort,
      }),
      metricInterval: options.metricsInterval,
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
