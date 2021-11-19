import { Controller, Get } from '@nestjs/common';
import { OtelMethodCounter } from 'nestjs-otel';
import { ReturnPayload } from 'src/domain';

import { ThothSpan } from '../infrastructure';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ThothSpan('CONTROLLER')
  @OtelMethodCounter()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('command')
  @ThothSpan('CONTROLLER')
  @OtelMethodCounter()
  runCommand(): ReturnPayload {
    return this.appService.runCommand();
  }

  @Get('throw')
  @ThothSpan('CONTROLLER')
  @OtelMethodCounter()
  runThrow(): void {
    this.appService.runThrow();
  }

  @Get('passthru')
  @ThothSpan('CONTROLLER')
  @OtelMethodCounter()
  async passthru(): Promise<string> {
    return await this.appService.passthru();
  }
}
