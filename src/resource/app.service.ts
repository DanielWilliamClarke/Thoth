import {Injectable, Logger} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {ThothSpan} from '../infrastructure';

import {ClientAPIService, CommandService, ReturnPayload} from '../domain';

@Injectable()
@Advised()
export class AppService {
  constructor(
    private readonly command: CommandService,
    private readonly clientApi: ClientAPIService,
    private readonly logger: Logger
  ) {}

  @ThothSpan('GET-HELLO-SERVICE')
  getHello(): string {
    return 'Hello World!';
  }

  @ThothSpan('RUN-COMMAND-SERVICE')
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

  @ThothSpan('RUN-THROW-SERVICE')
  runThrow(): void {
    try {
      this.command.DoThrow();
    } catch (ex) {
      this.logger.error(`Caught error: ${ex}`);
    }
  }

  @ThothSpan('PASS-THRU-SERVICE')
  async passthru(): Promise<string> {
    return await this.clientApi.Get();
  }
}
