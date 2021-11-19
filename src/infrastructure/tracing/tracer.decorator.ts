/* eslint-disable @typescript-eslint/no-explicit-any */
import { Span } from 'nestjs-otel';

const wrap = (name: string, method: any): ((...args: any[]) => any) => {
  class Wrapper {
    @Span(name)
    static unwrap(...args: any[]): any {
      return method.apply(this, args);
    }
  }
  return Wrapper.unwrap;
};

export function ThothSpan(name: string): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = wrap(
      `${name}_${String(propertyKey)}`.toUpperCase(),
      descriptor.value
    );
  };
}

export function ThothApplySpans(): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function <TFunction extends Function>(target: TFunction) {
    Object.entries(Object.getOwnPropertyDescriptors(target.prototype)).forEach(
      ([propertyName, descriptor]) => {
        const isMethod =
          typeof descriptor.value === 'function' &&
          propertyName !== 'constructor';
        if (!isMethod) {
          return;
        }

        descriptor.value = wrap(
          `${target.name}_${String(propertyName)}`.toUpperCase(),
          descriptor.value
        );
        Object.defineProperty(target.prototype, propertyName, descriptor);
      }
    );
  };
}
