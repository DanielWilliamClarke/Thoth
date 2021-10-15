import {Injectable} from '@nestjs/common';
import {Command, ReturnPayload} from 'src/domain';

@Injectable()
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
