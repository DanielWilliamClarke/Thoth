import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {ReturnPayload} from './dataaccess';
import {Repository} from './repository';

export type Payload = {
  data: string;
  attributes: Record<string, string>;
};

@Advised()
@Injectable()
export class Command {
  constructor(private respository: Repository) {}

  DoThing(payload: Payload): ReturnPayload {
    return this.respository.Get(payload);
  }
}
