import {Module} from '@nestjs/common';
import {LoggerModule} from 'nestjs-pino';
import {Command, DataAccess, Repository} from 'src/domain';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, Command, Repository, DataAccess],
})
export class AppModule {}