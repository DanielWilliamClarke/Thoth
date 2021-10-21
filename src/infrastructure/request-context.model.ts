import {AsyncLocalStorage} from 'async_hooks';

export class RequestContext {
  static asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  static get currentContext() {
    return this.asyncLocalStorage.getStore();
  }

  constructor(public readonly req: Request, public readonly res: Response) {}
}
