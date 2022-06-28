import {Span, SpanKind, trace} from '@opentelemetry/api';
import {SemanticAttributes} from '@opentelemetry/semantic-conventions';
import {
  ActiveSpanMethod,
  TracerContext,
} from '../../src/infrastructure/tracing/methodSpanDecorator';

class MethodActiveSpanDecoratorExample {
  // Standard usage, just apply the decorator and the method is instrumented
  @ActiveSpanMethod({
    tracer: trace.getTracer('example'),
    spanName: 'example-active-span',
    options: {
      kind: SpanKind.SERVER,
      attributes: {
        [SemanticAttributes.DB_NAME]: 'config',
        [SemanticAttributes.DB_SYSTEM]: 'rtdb',
        [SemanticAttributes.DB_OPERATION]: 'READ',
      },
    },
  })
  async withActiveSpan(input: string): Promise<string> {
    // The original implementation of the method is untouched
    return input.split('').reverse().join();
  }
  ///

  // All parameters of the decorator are completely
  // optional to cut down on boilerplate if not required
  @ActiveSpanMethod()
  async withActiveSpan_NoConfig(input: string): Promise<string> {
    // The original implementation of the method is untouched
    return input.split('').reverse().join();
  }
  ///

  // This example shows how the tracer context  can be injected into
  // the method to allow for fine grained observation with
  // the creation of child spans
  @ActiveSpanMethod({
    tracer: trace.getTracer('example'),
    spanName: 'example-active-span',
    options: {
      kind: SpanKind.SERVER,
      // we should aim to populate as many semantic attributes as possible
      attributes: {
        [SemanticAttributes.DB_NAME]: 'config',
        [SemanticAttributes.DB_SYSTEM]: 'rtdb',
        [SemanticAttributes.DB_OPERATION]: 'READ',
      },
    },
  })
  async withActiveSpan_WithInjectedTracer(
    input: string,
    _injectedContext?: TracerContext
  ): Promise<string> {
    // the tracer can be injected into the method for fine grained observation
    await _injectedContext?.tracer.startActiveSpan(
      'example-child-span',
      async (span: Span) => {
        // some long running process we want to observe
        await new Promise(resolve => setTimeout(resolve, 1000));
        span.end();
      }
    );

    return input.split('').reverse().join();
  }
  ///

  // All parameters of the decorator are completely
  // optional to cut down on boilerplate if not required
  // the tracer context can still be injected into the method
  @ActiveSpanMethod()
  async withActiveSpan_NoConfig_WithInjectedTracer(
    input: string,
    _injectedContext?: TracerContext
  ): Promise<string> {
    // a default tracer can still be injected into the method
    await _injectedContext?.tracer.startActiveSpan(
      'example-child-span',
      async (span: Span) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        span.end();
      }
    );

    return input.split('').reverse().join();
  }
  ///

  // The parent span can also be access via the injectedContext
  // this allows for greater optional control over the parent span
  @ActiveSpanMethod()
  async withActiveSpan_NoConfig_WithInjectedParentSpan(
    input: string,
    _injectedContext?: TracerContext
  ): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    _injectedContext.span.addEvent('some event occured');
    return input.split('').reverse().join();
  }
  ///

  // Decorating a non async method will result in an error thrown
  @ActiveSpanMethod()
  withActiveSpan_nonAsync_ThrowsError(
    input: string,
    _injectedContext?: TracerContext
  ): string {
    // this code will not be executed as an error will be thrown on class declaration
    _injectedContext.span.addEvent('some event occured');
    return input.split('').reverse().join();
  }
  ///
}

const main = async () => {
  // with active spans ============================
  // class is instanciated like any normal class
  const activeExample = new MethodActiveSpanDecoratorExample();
  // methods are invoked like any normal class method
  const output_active = await activeExample.withActiveSpan('racecar');
  const output_active_noConfig = await activeExample.withActiveSpan_NoConfig(
    'hannah'
  );

  // notice at the top level methods with the injected tracer defined
  //  in method arguments do not need to be passed the tracer
  const output_active_withInjectedTracer =
    await activeExample.withActiveSpan_WithInjectedTracer('repaper');
  const output_active_noConfig_withInjectedTracer =
    await activeExample.withActiveSpan_NoConfig_WithInjectedTracer('deified');
  const output_active_noConfig_withInjectedParentSpan =
    await activeExample.withActiveSpan_NoConfig_WithInjectedParentSpan('noon');

  // Throws at runtime on class declaration
  activeExample.withActiveSpan_nonAsync_ThrowsError('kayak');
};
