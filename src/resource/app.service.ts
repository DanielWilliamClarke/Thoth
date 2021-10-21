import {Injectable, Logger} from '@nestjs/common';
import {Advised} from 'aspect.js';
import {Command, ClientAPI, ReturnPayload} from '../domain';
import {Span} from 'nestjs-otel';
import {firstValueFrom} from 'rxjs';

@Injectable()
@Advised()
export class AppService {
  constructor(
    private readonly command: Command,
    private readonly clientApi: ClientAPI,
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

  @Span('PASS-THRU')
  async passthru(): Promise<string> {
    return await this.clientApi.Get();
  }
}
