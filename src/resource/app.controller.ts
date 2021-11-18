import {Controller, Get} from '@nestjs/common';
import {OtelMethodCounter} from 'nestjs-otel';
import {ThothSpan} from '../infrastructure';
import {ReturnPayload} from 'src/domain';
import {AppService} from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ThothSpan('GET-HELLO')
  @OtelMethodCounter()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('command')
  @ThothSpan('RUN-COMMAND')
  @OtelMethodCounter()
  runCommand(): ReturnPayload {
    return this.appService.runCommand();
  }

  @Get('throw')
  @ThothSpan('RUN-THROW')
  @OtelMethodCounter()
  runThrow(): void {
    this.appService.runThrow();
  }

  @Get('passthru')
  @ThothSpan('PASS-THRU')
  @OtelMethodCounter()
  async passthru(): Promise<string> {
    return await this.appService.passthru();
  }
}
