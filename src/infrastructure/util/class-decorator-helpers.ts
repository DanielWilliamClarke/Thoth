import {isFunction} from 'lodash';

export type GenericMethod = (...args: any[]) => any;

export class ClassDecoratorHelpers {
  static wrapAllMethods(
    target: Function,
    wrapper: (
      name: string,
      propertyName: string,
      method: GenericMethod
    ) => GenericMethod
  ) {
    Object.entries(Object.getOwnPropertyDescriptors(target.prototype))
      .filter(
        ([propertyName, {value}]: [string, any]) =>
          isFunction(value) && propertyName !== 'constructor'
      )
      .forEach(([propertyName, descriptor]: [string, PropertyDescriptor]) =>
        Object.defineProperty(target.prototype, propertyName, {
          ...descriptor,
          value: wrapper(target.name, propertyName, descriptor.value),
        })
      );
  }
}
