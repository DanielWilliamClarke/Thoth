import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Advised } from 'aspect.js';
import { AxiosResponse } from 'axios';
import { OtelMethodCounter, TraceService } from 'nestjs-otel';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ThothTraceClass } from '../infrastructure';

@Injectable()
@Advised()
@ThothTraceClass
export class ClientAPIService {
  constructor(
    private readonly logger: Logger,
    private httpService: HttpService,
    private readonly traceService: TraceService
  ) {}

  @OtelMethodCounter()
  async Get(): Promise<string> {
    this.logger.log('calling /api on self');

    const url = 'http://localhost:5555/api';
    const span = this.traceService.startSpan('CLIENT-API-SUB-SPAN'); // start new span
    span.setAttributes({CUSTOM_DATA: 'TEST'});
    const call$ = this.httpService.get<string>(url).pipe(
      map((axiosResponse: AxiosResponse<string>) => {
        return axiosResponse.data;
      })
    );
    span.end();

    return await firstValueFrom(call$);
  }
}
