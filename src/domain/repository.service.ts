import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {Payload} from './command.service';
import {DataAccessService, ReturnPayload} from './dataaccess.service';

@Injectable()
@Advised()
export class RepositoryService {
  constructor(private readonly dataaccess: DataAccessService) {}

  Get({data, attributes}: Payload): ReturnPayload {
    return this.dataaccess.Get(data, attributes);
  }
}
