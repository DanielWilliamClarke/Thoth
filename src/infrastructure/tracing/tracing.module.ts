import {DynamicModule, Module} from '@nestjs/common';
import {OpenTelemetryModule} from 'nestjs-otel';
import {Tracer, TracerOptions} from './tracer';
import * as process from 'process';

@Module({})
export class TracingModule {
  static async forRoot(options: TracerOptions): Promise<DynamicModule> {
    const tracer = Tracer.build(options);
    await tracer.start();

    // You can also use the shutdown method to gracefully shut down the SDK before process shutdown
    // or on some operating system signal.
    process.on('SIGTERM', () => {
      tracer
        .shutdown()
        .then(
          () => console.log('SDK shut down successfully'),
          err => console.log('Error shutting down SDK', err)
        )
        // eslint-disable-next-line no-process-exit
        .finally(() => process.exit(0));
    });

    return {
      module: TracingModule,
      imports: [
        OpenTelemetryModule.forRoot({
          metrics: {
            hostMetrics: true, // Includes Host Metrics
            defaultMetrics: true, // Includes Default Metrics
            apiMetrics: {
              enable: true, // Includes api metrics
            },
          },
        }),
      ],
    };
  }
}
