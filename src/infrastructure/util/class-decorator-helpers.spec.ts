import {isFunction} from 'lodash';

/* eslint-disable @typescript-eslint/no-empty-function */
import {ClassDecoratorHelpers, GenericMethod} from './class-decorator-helpers';

describe('ClassDecoratorHelpers', () => {
  it('wrapAllMethods', () => {
    const mockFn = jest.fn();

    const totalMethods = 10;
    class Test {
      do() {}
      ra() {}
      me() {}
      fa() {}
      sol() {}
      la() {}
      private si() {}

      static eeny() {}
      static meeny() {}
      static mo() {}
    }

    ClassDecoratorHelpers.wrapAllMethods(
      Test,
      (
        name: string,
        propertyName: string,
        method: GenericMethod
      ): GenericMethod => {
        return (...args: any[]): any => {
          method.apply(this, ...args);
          mockFn();
        };
      }
    );

    // Now only a small amount of jank
    Object.entries(Object.getOwnPropertyDescriptors(Test.prototype))
      .filter(
        ([propertyName, {value}]: [string, PropertyDescriptor]) =>
          isFunction(value) && propertyName !== 'constructor'
      )
      .reduce(
        (
          instance: Test,
          [propertyName]: [string, PropertyDescriptor]
        ): Test => {
          instance[propertyName]();
          return instance;
        },
        new Test()
      );

    expect(mockFn).toHaveBeenCalledTimes(totalMethods);
  });
});
