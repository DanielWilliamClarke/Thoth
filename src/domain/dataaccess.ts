import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';

export type ReturnPayload = {
  [K: string]: string;
};

@Injectable()
@Advised()
export class DataAccess {
  Get(data: string, attributes: Record<string, string>): ReturnPayload {
    console.log(`Using ${data} to make a query`);
    return {
      some: 'useful',
      data: 'which',
      we: 'need',
      ...attributes,
    };
  }
}
