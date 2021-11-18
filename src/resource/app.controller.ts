import { Controller, Get } from '@nestjs/common';
import { OtelMethodCounter, Span } from 'nestjs-otel';
import { ReturnPayload } from 'src/domain';

import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Span('GET-HELLO')
  @OtelMethodCounter()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('command')
  @Span('RUN-COMMAND')
  @OtelMethodCounter()
  runCommand(): ReturnPayload {
    return this.appService.runCommand();
  }

  @Get('throw')
  @Span('RUN-THROW')
  @OtelMethodCounter()
  runThrow(): void {
    this.appService.runThrow();
  }

  @Get('passthru')
  @Span('PASS-THRU')
  @OtelMethodCounter()
  async passthru(): Promise<string> {
    return await this.appService.passthru();
  }
}
