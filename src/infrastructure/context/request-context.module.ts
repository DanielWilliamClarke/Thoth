import {Logger, Module, OnModuleInit} from '@nestjs/common';
import {RequestContextMiddleware} from './request-context.middleware';
import {RequestContextService} from './request-context.service';
import {HttpModule, HttpService} from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [RequestContextMiddleware, RequestContextService, Logger],
  exports: [RequestContextMiddleware, RequestContextService],
})
export class RequestContextModule implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly contextService: RequestContextService,
    private httpService: HttpService
  ) {}

  public onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use(req => {
      const requestId = this.contextService.currentRequestId;
      req.headers.common['X-Request-Id'] = requestId;

      this.logger.log(
        `Intercepting ${req.method} request to ${req.url} adding X-Request-ID ${requestId}`
      );

      return req;
    });
  }
}
