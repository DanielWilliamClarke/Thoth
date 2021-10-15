import {Injectable} from '@nestjs/common';

export type ReturnPayload = {
  [K: string]: string;
};

@Injectable()
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
