import util from 'util';

import {Span, SpanOptions, trace, Tracer} from '@opentelemetry/api';

type AsyncGenericMethod = (...args: never[]) => Promise<never>;
type GenericConstructor = {constructor: {name: string}};

export type TracerConfig = {
  tracer?: Tracer;
  spanName?: string;
  options?: SpanOptions;
};
export type TracerContext = {tracer: Tracer; span: Span};

export function ActiveSpanMethod(config?: TracerConfig): MethodDecorator {
  const tracer = config?.tracer ?? trace.getTracer('default');
  const options = config?.options ?? {};

  return function (
    target: GenericConstructor,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const className = target.constructor.name;
    const methodName = String(propertyKey);
    const spanName = config?.spanName ?? `span_${className}_${methodName}`;

    if (!util.types.isAsyncFunction(descriptor.value)) {
      const reason = `Decorated method ${className}.${methodName} is not async, decorating an non-async method could lead to return type confusion`;
      console.error(reason);
      throw new Error(reason);
    }

    const fn = descriptor.value as AsyncGenericMethod;
    descriptor.value = async function (...args: never[]): Promise<never> {
      return tracer.startActiveSpan(
        spanName,
        options,
        async (span: Span): Promise<never> => {
          span.setAttributes({
            className,
            methodName,
            params: args,
          });
          const context: TracerContext = {tracer, span};
          const result = (await fn.apply(this, [
            ...args,
            context as never,
          ])) as never;
          span.end();
          return result;
        }
      );
    };
    return descriptor;
  };
}
