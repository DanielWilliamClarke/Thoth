import { Controller, Get } from '@nestjs/common';
import { OtelMethodCounter } from 'nestjs-otel';
import { ReturnPayload } from 'src/domain';

import { ThothTraceMethod } from '../infrastructure';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ThothTraceMethod
  @OtelMethodCounter()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('command')
  @ThothTraceMethod
  @OtelMethodCounter()
  runCommand(): ReturnPayload {
    return this.appService.runCommand();
  }

  @Get('throw')
  @ThothTraceMethod
  @OtelMethodCounter()
  runThrow(): void {
    this.appService.runThrow();
  }

  @Get('passthru')
  @ThothTraceMethod
  @OtelMethodCounter()
  async passthru(): Promise<string> {
    return await this.appService.passthru();
  }
}
