import {Injectable} from '@nestjs/common';
import {ReturnPayload} from './dataaccess';
import {Repository} from './repository';

export type Payload = {
  data: string;
  attributes: Record<string, string>;
};

@Injectable()
export class Command {
  constructor(private respository: Repository) {}

  DoThing(payload: Payload): ReturnPayload {
    return this.respository.Get(payload);
  }
}
