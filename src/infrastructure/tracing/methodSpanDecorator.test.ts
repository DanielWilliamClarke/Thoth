/* eslint-disable jest/no-conditional-expect */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {Tracer, Span, SpanKind, SpanOptions} from '@opentelemetry/api';
import {SemanticAttributes} from '@opentelemetry/semantic-conventions';

import {ActiveSpanMethod, TracerContext} from './methodSpanDecorator';

describe('methodSpanDecorator', () => {
  const createData = (): [string, SpanOptions] => {
    const spanName = 'span-name';
    const options = {
      kind: SpanKind.CLIENT,
      // we should aim to populate as many semantic attributes as possible
      attributes: {
        [SemanticAttributes.DB_NAME]: 'config',
        [SemanticAttributes.DB_SYSTEM]: 'rtdb',
        [SemanticAttributes.DB_OPERATION]: 'READ',
      },
    };

    return [spanName, options];
  };

  const createMocks = (): [Tracer, Partial<Span>] => {
    const setAttributesMock = jest.fn();
    const mockSpan = <Partial<Span>>{
      setAttributes: setAttributesMock,
      addEvent: jest.fn(),
      end: jest.fn(),
    };

    const startActiveSpanMock = jest.fn();
    startActiveSpanMock.mockImplementation(
      async (
        _1: string,
        _2: SpanOptions,
        callback: (span: Span) => Promise<never>
      ) => {
        return callback(mockSpan as Span);
      }
    );

    const startSpanMock = jest.fn();
    startSpanMock.mockReturnValue(mockSpan);
    setAttributesMock.mockReturnValue(mockSpan);

    // Create tracer mock
    const tracerMock: Tracer = {
      startActiveSpan: startActiveSpanMock,
      startSpan: startSpanMock,
    };

    return [tracerMock, mockSpan];
  };

  describe('Tracer Start Active Span', () => {
    test('can decorate a class method', async () => {
      const [tracer, mockSpan] = createMocks();
      const [spanName, options] = createData();

      // Create decorated class
      class Undertest {
        @ActiveSpanMethod({
          tracer,
          spanName,
          options,
        })
        async method() {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('Doing some work');
          return true;
        }
      }

      // Act
      const instance = new Undertest();
      const result = await instance.method();

      // Expect
      expect(result).toBeTruthy();

      expect(tracer.startActiveSpan).toHaveBeenCalledTimes(1);
      expect(tracer.startActiveSpan).toHaveBeenCalledWith(
        spanName,
        options,
        expect.anything()
      );

      expect(mockSpan.setAttributes).toHaveBeenCalledTimes(1);
      expect(mockSpan.setAttributes).toHaveBeenCalledWith({
        className: expect.any(String),
        methodName: expect.any(String),
      });

      expect(mockSpan.end).toHaveBeenCalledTimes(1);
    });

    test('can decorate a class method with minimal config', async () => {
      const [tracer, mockSpan] = createMocks();

      // Create decorated class
      class Undertest {
        @ActiveSpanMethod({
          tracer,
        })
        async method() {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('Doing some work');
          return true;
        }
      }

      // Act
      const instance = new Undertest();
      const result = await instance.method();

      // Expect
      expect(result).toBeTruthy();

      expect(tracer.startActiveSpan).toHaveBeenCalledTimes(1);
      expect(tracer.startActiveSpan).toHaveBeenCalledWith(
        'span_Undertest_method',
        {},
        expect.anything()
      );

      expect(mockSpan.setAttributes).toHaveBeenCalledTimes(1);
      expect(mockSpan.setAttributes).toHaveBeenCalledWith({
        className: expect.any(String),
        methodName: expect.any(String),
      });

      expect(mockSpan.end).toHaveBeenCalledTimes(1);
    });

    test('can pass tracer context to allow for child spans', async () => {
      const [tracer, mockSpan] = createMocks();
      const [spanName, options] = createData();

      // Create decorated class
      class Undertest {
        @ActiveSpanMethod({
          tracer,
          spanName,
          options,
        })
        async method(input: string, _injectedContext?: TracerContext) {
          // tracer is passed in from the decorator
          await _injectedContext?.tracer.startActiveSpan(
            'child-span',
            options,
            async (span: Span) => {
              await new Promise(resolve => setTimeout(resolve, 100));
              span.end();
            }
          );

          console.log(`Doing some work - ${input}`);
          return input;
        }
      }

      // Act
      const input = 'some test passed in';
      const instance = new Undertest();
      const result = await instance.method(input);

      // Expect
      expect(result).toBe(input);

      expect(tracer.startActiveSpan).toHaveBeenCalledTimes(2);
      expect(tracer.startActiveSpan).toHaveBeenNthCalledWith(
        1,
        spanName,
        options,
        expect.anything()
      );
      expect(tracer.startActiveSpan).toHaveBeenLastCalledWith(
        'child-span',
        options,
        expect.anything()
      );

      expect(mockSpan.setAttributes).toHaveBeenCalledTimes(1);
      expect(mockSpan.setAttributes).toHaveBeenCalledWith({
        className: expect.any(String),
        methodName: expect.any(String),
      });

      expect(mockSpan.end).toHaveBeenCalledTimes(2);
    });

    test('can pass tracer context to allow for parent span modification', async () => {
      const [tracer, mockSpan] = createMocks();
      const [spanName, options] = createData();

      // Create decorated class
      class Undertest {
        @ActiveSpanMethod({
          tracer,
          spanName,
          options,
        })
        async method(input: string, _injectedContext?: TracerContext) {
          await new Promise(resolve => setTimeout(resolve, 100));
          _injectedContext?.span.addEvent('something happened');

          console.log(`Doing some work - ${input}`);
          return input;
        }
      }

      // Act
      const input = 'some test passed in';
      const instance = new Undertest();
      const result = await instance.method(input);

      // Expect
      expect(result).toBe(input);

      expect(tracer.startActiveSpan).toHaveBeenCalledTimes(1);
      expect(tracer.startActiveSpan).toHaveBeenCalledWith(
        spanName,
        options,
        expect.anything()
      );

      expect(mockSpan.setAttributes).toHaveBeenCalledTimes(1);
      expect(mockSpan.setAttributes).toHaveBeenCalledWith({
        className: expect.any(String),
        methodName: expect.any(String),
      });

      expect(mockSpan.addEvent).toHaveBeenCalledTimes(1);
      expect(mockSpan.addEvent).toHaveBeenCalledWith(expect.any(String));

      expect(mockSpan.end).toHaveBeenCalledTimes(1);
    });

    test('can throw error when non async method is decorated', () => {
      const [tracer, mockSpan] = createMocks();
      const [spanName, options] = createData();

      try {
        // Create decorated class
        class Undertest {
          @ActiveSpanMethod({
            tracer,
            spanName,
            options,
          })
          method(input: string, _injectedContext?: TracerContext) {
            _injectedContext?.span.addEvent('something happened');

            console.log(`Doing some work - ${input}`);
            return input;
          }
        }

        const input = 'some test passed in';
        const instance = new Undertest();
        instance.method(input);
      } catch (error) {
        expect((error as Error).message).toEqual(
          expect.stringContaining(
            'Decorated method Undertest.method is not async'
          )
        );
      }

      expect(tracer.startActiveSpan).not.toHaveBeenCalled();
      expect(tracer.startActiveSpan).not.toHaveBeenCalledWith(
        spanName,
        options,
        expect.anything()
      );

      expect(mockSpan.setAttributes).not.toHaveBeenCalled();
      expect(mockSpan.setAttributes).not.toHaveBeenCalledWith({
        className: expect.any(String),
        methodName: expect.any(String),
      });

      expect(mockSpan.addEvent).not.toHaveBeenCalled();
      expect(mockSpan.addEvent).not.toHaveBeenCalledWith(expect.any(String));

      expect(mockSpan.end).not.toHaveBeenCalled();
    });
  });
});
