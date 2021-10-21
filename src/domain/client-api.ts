import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {Logger} from '@nestjs/common';
import {RequestContextService} from '../infrastructure';
import {firstValueFrom} from 'rxjs';
import {map} from 'rxjs/operators';
import {AxiosResponse} from 'axios';

@Injectable()
@Advised()
export class ClientAPI {
  constructor(
    private readonly logger: Logger,
    private readonly contextService: RequestContextService,
    private httpService: HttpService
  ) {}

  async Get(): Promise<string> {
    this.logger.log('calling /api on self');

    const url = 'http://localhost:5555/api';

    // Here I can extract request id out of the context and pass it forward
    // opentelemetry traceId is also passed implicitly
    const config = {
      headers: {
        'X-Request-Id': this.contextService.currentRequestId,
      },
    };

    const call$ = this.httpService.get<string>(url, config).pipe(
      map((axiosResponse: AxiosResponse<string>) => {
        return axiosResponse.data;
      })
    );

    return await firstValueFrom(call$);
  }
}
