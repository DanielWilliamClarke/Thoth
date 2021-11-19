import { Injectable, NestMiddleware } from '@nestjs/common';

import { ThothApplySpans } from '../../infrastructure';
import { RequestContext } from './request-context.model';

/**
 * This is needed to side-step Nest.js, which doesn't support getting the current execution context (i.e. Request) that's
 * not from the Controller handles directly (and passing it down explicitly). This means that things like a Logger can't
 * use DI to get the current user (if any).
 *
 * This solution is taken from https://github.com/nestjs/nest/issues/699#issuecomment-405868782.
 */
@Injectable()
@ThothApplySpans()
export class RequestContextMiddleware
  implements NestMiddleware<Request, Response>
{
  use(req: Request, res: Response, next: () => void) {
    RequestContext.asyncLocalStorage.run(new RequestContext(req, res), next);
  }
}
