import {Module, Logger} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {Command, Repository, DataAccess, ClientAPI} from '.';
import {RequestContextModule} from '../infrastructure';

@Module({
  imports: [HttpModule, RequestContextModule],
  providers: [Logger, Command, Repository, DataAccess, ClientAPI],
  exports: [Command, ClientAPI],
})
export class DomainModule {}
