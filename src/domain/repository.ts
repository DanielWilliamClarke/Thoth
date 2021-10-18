import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {Payload} from './command';
import {DataAccess, ReturnPayload} from './dataaccess';

@Injectable()
@Advised()
export class Repository {
  constructor(private readonly dataaccess: DataAccess) {}

  Get({data, attributes}: Payload): ReturnPayload {
    return this.dataaccess.Get(data, attributes);
  }
}
