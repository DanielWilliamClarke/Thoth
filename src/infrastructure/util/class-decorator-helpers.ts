/* eslint-disable @typescript-eslint/no-explicit-any */
import {isFunction} from 'lodash';

export type GenericMethod = (...args: any[]) => any;

type Wrapper = (
  name: string,
  propertyName: string,
  method: GenericMethod
) => GenericMethod;

export class ClassDecoratorHelpers {
  static wrapAllMethods(target: any, wrapper: Wrapper) {
    [target.prototype, target].reduce(
      (acc: ClassDecoratorHelpers, destination: any) =>
        acc.applyWrapping(destination, target.name, wrapper),
      new ClassDecoratorHelpers()
    );
  }

  private applyWrapping(
    destination: any,
    name: string,
    wrapper: Wrapper
  ): ClassDecoratorHelpers {
    Object.entries(Object.getOwnPropertyDescriptors(destination))
      .filter(this.isMethod)
      .forEach(([propertyName, descriptor]: [string, PropertyDescriptor]) =>
        Object.defineProperty(destination, propertyName, {
          ...descriptor,
          value: wrapper(name, propertyName, descriptor.value),
        })
      );

    return this;
  }

  private isMethod([propertyName, {value}]: [string, any]): boolean {
    return isFunction(value) && propertyName !== 'constructor';
  }
}
