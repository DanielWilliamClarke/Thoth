/* eslint-disable @typescript-eslint/no-explicit-any */
import {Span} from 'nestjs-otel';

export function ThothSpan(name: string): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const cb = descriptor.value;

    class SpanWrapper {
      @Span(`${name}_${String(propertyKey)}`)
      static unwrap(this: any, ...args: any[]): any {
        return cb.apply(this, args);
      }
    }

    descriptor.value = SpanWrapper.unwrap;
  };
}
