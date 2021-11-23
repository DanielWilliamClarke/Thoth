import { ClassDecoratorHelpers, GenericMethod } from './class-decorator-helpers';

describe('ClassDecoratorHelpers', () => {
  it('wrapAllMethods', () => {
    const mockFn = jest.fn();

    class Test {
      do() {}
      ra() {}
      me() {}
      fa() {}
      sol() {}
      la() {}
      si() {}
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
    const instance = new Test();

    const callableMethods = Object.entries(
      Object.getOwnPropertyDescriptors(instance)
    ).filter(
      ([propertyName]: [string, PropertyDescriptor]) =>
        propertyName !== 'constructor'
    );

    callableMethods.forEach(([, {value}]: [string, any]) => value);

    expect(mockFn).toHaveBeenCalledTimes(callableMethods.length);
  });
});
