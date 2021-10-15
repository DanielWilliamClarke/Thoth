import {Controller, Get, Headers, Injectable} from '@nestjs/common';
import {ReturnPayload} from 'src/domain';
import {AppService} from './app.service';

import '../infrastructure/logger.aspect';
import {Advised} from 'aspect.js';

@Advised({setHeaders: true})
@Injectable()
export class AppControllerImpl {
  constructor(private readonly appService: AppService) {}

  getHello(): string {
    return this.appService.getHello();
  }

  runCommand(headers: any): ReturnPayload {
    return this.appService.runCommand();
  }
}

@Controller('api')
export class AppController {
  constructor(private readonly impl: AppControllerImpl) {}

  @Get()
  getHello(): string {
    return this.impl.getHello();
  }

  @Get('command')
  runCommand(@Headers() headers: any): ReturnPayload {
    return this.impl.runCommand(headers);
  }
}
