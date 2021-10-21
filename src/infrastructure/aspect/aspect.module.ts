import {DynamicModule, Module} from '@nestjs/common';
import {AspectLogger, ILogger} from './aspect-logger';

type AspectOptions = {
  logger: ILogger;
};

@Module({})
export class AspectModule {
  static forRoot(config: AspectOptions): DynamicModule {
    AspectLogger.logger = config.logger;
    return {
      module: AspectModule,
    };
  }
}
