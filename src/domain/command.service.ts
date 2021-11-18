import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {ThothSpan} from '../infrastructure';
import {ReturnPayload} from './dataaccess.service';
import {RepositoryService} from './repository.service';

export type Payload = {
  data: string;
  attributes: Record<string, string>;
};

@Advised()
@Injectable()
export class CommandService {
  constructor(private readonly respository: RepositoryService) {}

  @ThothSpan('DO-THING')
  DoThing(payload: Payload): ReturnPayload {
    return this.respository.Get(payload);
  }

  @ThothSpan('DO-THROW')
  DoThrow(): void {
    throw new Error('fake failure');
  }
}
