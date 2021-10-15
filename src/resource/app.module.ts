import {Module} from '@nestjs/common';
import {Command, DataAccess, Repository} from 'src/domain';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Command, Repository, DataAccess],
})
export class AppModule {}
