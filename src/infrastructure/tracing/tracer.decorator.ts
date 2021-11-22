/* eslint-disable @typescript-eslint/no-explicit-any */
import {isFunction} from 'lodash';
import {Span} from 'nestjs-otel';

class TraceUtils {
  static wrap(
    className: string,
    methodName: string,
    method: any
  ): (...args: any[]) => any {
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
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  descriptor.value = TraceUtils.wrap(
    target.constructor.name,
    String(propertyKey),
    descriptor.value
  );
}

export function ThothTraceClass<TFunction extends Function>(target: TFunction) {
  Object.entries(Object.getOwnPropertyDescriptors(target.prototype))
    .filter(
      ([propertyName, {value}]: [string, any]) =>
        isFunction(value) && propertyName !== 'constructor'
    )
    .forEach(([propertyName, descriptor]: [string, PropertyDescriptor]) =>
      Object.defineProperty(target.prototype, propertyName, {
        ...descriptor,
        value: TraceUtils.wrap(target.name, propertyName, descriptor.value),
      })
    );
}
