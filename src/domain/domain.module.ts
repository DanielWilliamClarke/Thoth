import {Module, Logger} from '@nestjs/common';
import {
  CommandService,
  RepositoryService,
  DataAccessService,
  ClientAPIService,
} from '.';
import {RequestContextModule} from '../infrastructure';
import {TraceService} from 'nestjs-otel';

@Module({
  imports: [RequestContextModule],
  providers: [
    Logger,
    CommandService,
    RepositoryService,
    DataAccessService,
    ClientAPIService,
    TraceService,
  ],
  exports: [CommandService, ClientAPIService],
})
export class DomainModule {}
