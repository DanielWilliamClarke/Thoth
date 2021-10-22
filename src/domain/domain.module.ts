import {Module, Logger} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {
  CommandService,
  RepositoryService,
  DataAccessService,
  ClientAPIService,
} from '.';
import {RequestContextModule} from '../infrastructure';

@Module({
  imports: [RequestContextModule],
  providers: [
    Logger,
    CommandService,
    RepositoryService,
    DataAccessService,
    ClientAPIService,
  ],
  exports: [CommandService, ClientAPIService],
})
export class DomainModule {}
