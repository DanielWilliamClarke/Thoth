import {Injectable} from '@nestjs/common';
import {Payload} from './command';
import {DataAccess, ReturnPayload} from './dataaccess';

@Injectable()
export class Repository {
  constructor(private dataaccess: DataAccess) {}

  Get({data, attributes}: Payload): ReturnPayload {
    return this.dataaccess.Get(data, attributes);
  }
}
