import {Injectable, Logger} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {Command, ReturnPayload} from '../domain';
import {Span} from 'nestjs-otel';

@Injectable()
@Advised()
export class AppService {
  constructor(
    private readonly command: Command,
    private readonly logger: Logger
  ) {}

  @Span('GET-HELLO')
  getHello(): string {
    return 'Hello World!';
  }

  @Span('RUN-COMMAND')
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

  @Span('RUN-THROW')
  runThrow(): void {
    try {
      this.command.DoThrow();
    } catch (ex) {
      this.logger.error(`Caught error: ${ex}`);
    }
  }
}
