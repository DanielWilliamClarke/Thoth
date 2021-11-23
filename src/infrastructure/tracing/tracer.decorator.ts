/* eslint-disable @typescript-eslint/no-explicit-any */
import { Span } from 'nestjs-otel';

import { ClassDecoratorHelpers, GenericMethod } from '../util/class-decorator-helpers';

class TraceUtils {
  static wrap(
    className: string,
    methodName: string,
    method: GenericMethod
  ): GenericMethod {
    class Wrapper {
      @Span(`${className}_${methodName}`.toUpperCase())
      static unwrap(...args: any[]): any {
        return method.apply(this, args);
      }
    }
    return Wrapper.unwrap;
  }
}

export function ThothTraceMethod(
  target: {constructor: Function},
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  descriptor.value = TraceUtils.wrap(
    target.constructor.name,
    String(propertyKey),
    descriptor.value
  );
}

export function ThothTraceClass(target: Function) {
  ClassDecoratorHelpers.wrapAllMethods(
    target,
    (
      name: string,
      propertyName: string,
      method: GenericMethod
    ): GenericMethod => TraceUtils.wrap(name, propertyName, method)
  );
}
