import {Injectable} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {Command, ReturnPayload} from '../domain';

@Injectable()
@Advised()
export class AppService {
  constructor(private command: Command) {}

  getHello(): string {
    return 'Hello World!';
  }

  runCommand(): ReturnPayload {
    return this.command.DoThing({
      data: 'Complex query string',
      attributes: {
        something: 'that',
        I: 'need',
        To: 'Find',
      },
    });
  }
}
