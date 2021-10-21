import {Injectable} from '@nestjs/common';
import {RequestContext} from './request-context.model';

@Injectable()
export class RequestContextService {
  get currentRequest(): Request {
    return RequestContext.currentContext.req;
  }

  get currentRequestId(): string {
    // this actually allows us to extract the req.id
    const req = RequestContext.currentContext.req;
    return (req as unknown as {id: string}).id;
  }
}
