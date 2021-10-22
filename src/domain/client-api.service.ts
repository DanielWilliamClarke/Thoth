import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {Logger} from '@nestjs/common';

import {firstValueFrom} from 'rxjs';
import {map} from 'rxjs/operators';
import {AxiosResponse} from 'axios';
@Injectable()
@Advised()
export class ClientAPIService {
  constructor(
    private readonly logger: Logger,
    private httpService: HttpService
  ) {}

  async Get(): Promise<string> {
    this.logger.log('calling /api on self');

    const url = 'http://localhost:5555/api';
    const call$ = this.httpService.get<string>(url).pipe(
      map((axiosResponse: AxiosResponse<string>) => {
        return axiosResponse.data;
      })
    );

    return await firstValueFrom(call$);
  }
}
