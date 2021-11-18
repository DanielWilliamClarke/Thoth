import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
import { Span } from 'nestjs-otel';
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

  @Span('DO-THING')
  DoThing(payload: Payload): ReturnPayload {
    return this.respository.Get(payload);
  }

  @Span('DO-THROW')
  DoThrow(): void {
    throw new Error('fake failure');
  }
}
