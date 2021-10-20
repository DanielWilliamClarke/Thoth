import {Controller, Get} from '@nestjs/common';
import {ReturnPayload} from 'src/domain';
import {AppService} from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('command')
  runCommand(): ReturnPayload {
    return this.appService.runCommand();
  }

  @Get('throw')
  runThrow(): void {
    this.appService.runThrow();
  }
}
