import {DynamicModule, Module} from '@nestjs/common';
import {AspectLoggerService, ILogger} from './aspect.service';

type AspectOptions = {
  logger: ILogger;
};

@Module({})
export class AspectModule {
  static forRoot(config: AspectOptions): DynamicModule {
    AspectLoggerService.logger = config.logger;
    return {
      module: AspectModule,
      providers: [AspectLoggerService],
      exports: [AspectLoggerService],
    };
  }
}
