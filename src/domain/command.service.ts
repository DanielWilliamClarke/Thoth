import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
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

  DoThing(payload: Payload): ReturnPayload {
    return this.respository.Get(payload);
  }

  DoThrow(): void {
    throw new Error('fake failure');
  }
}
