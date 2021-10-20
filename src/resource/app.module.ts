import {Logger, Module} from '@nestjs/common';
import {Command, DataAccess, Repository} from '../domain';
import {OpenTelemetryModuleConfig, LoggerModuleConfig} from '../infrastructure';


import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [OpenTelemetryModuleConfig, LoggerModuleConfig],
  controllers: [AppController],
  providers: [AppService, Command, Repository, DataAccess, Logger],
})
export class AppModule {}
