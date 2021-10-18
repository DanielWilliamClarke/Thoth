import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {Logger} from '@nestjs/common';

export type ReturnPayload = {
  [K: string]: string;
};

@Injectable()
@Advised()
export class DataAccess {
  constructor(private readonly logger: Logger) {}

  Get(data: string, attributes: Record<string, string>): ReturnPayload {
    this.logger.log(`Using ${data} to make a query`);
    return {
      some: 'useful',
      data: 'which',
      we: 'need',
      ...attributes,
    };
  }
}
