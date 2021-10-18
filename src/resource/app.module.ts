import {Logger, Module} from '@nestjs/common';
import {createStream} from '@binxhealth/pino-stackdriver';
import {LoggerModule} from 'nestjs-pino';
import {Command, DataAccess, Repository} from '../domain';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: [{}, createStream()],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Command, Repository, DataAccess, Logger],
})
export class AppModule {}
