import {Injectable, Logger} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {Command, ReturnPayload} from '../domain';

@Injectable()
@Advised()
export class AppService {
  constructor(
    private readonly command: Command,
    private readonly logger: Logger
  ) {}

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

  runThrow(): void {
    try {
      this.command.DoThrow();
    } catch (ex) {
      this.logger.error(`Caught error: ${ex}`);
    }
  }
}
