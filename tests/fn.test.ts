import { fx } from "../src/index";
import { fn } from "../src/fn";
import { UnhandledError } from "../src/errors";

describe('fn', () => {
  describe('sync functions', () => {
    it('should wrap successful sync functions', () => {
      const successfulFn = fn(() => fx.ok(42));
      const result = successfulFn();
      expect(result).toEqual([null, 42]);
    });

    it('should wrap error sync functions', () => {
      const errorFn = fn(() => fx.err(new Error('Expected error')));
      const result = errorFn();
      expect(result).toEqual([new Error('Expected error'), null]);
    });

    it('should catch unhandled exceptions and wrap them in UnhandledError', () => {
      const throwingFn = fn(() => {
        throw new Error('Unhandled exception');
      });
      const result = throwingFn();
      expect(fx.isErr(result)).toBe(true);
      if (fx.isErr(result)) {
        expect(result[0]).toBeInstanceOf(UnhandledError);
        expect((result[0] as UnhandledError).originalError).toEqual(new Error('Unhandled exception'));
      }
    });

    it('should work with functions that take parameters', () => {
      const addFn = fn((a: number, b: number) => {
        if (a < 0 || b < 0) {
          return fx.err(new Error('Negative numbers not allowed'));
        }
        return fx.ok(a + b);
      });

      const successResult = addFn(2, 3);
      expect(successResult).toEqual([null, 5]);

      const errorResult = addFn(-1, 3);
      expect(errorResult).toEqual([new Error('Negative numbers not allowed'), null]);
    });
  });

  describe('async functions', () => {
    it('should wrap successful async functions', async () => {
      const successfulAsyncFn = fn(async () => fx.ok(42));
      const result = await successfulAsyncFn();
      expect(result).toEqual([null, 42]);
    });

    it('should wrap error async functions', async () => {
      const errorAsyncFn = fn(async () => fx.err(new Error('Expected error')));
      const result = await errorAsyncFn();
      expect(result).toEqual([new Error('Expected error'), null]);
    });

    it('should catch unhandled async exceptions and wrap them in UnhandledError', async () => {
      const throwingAsyncFn = fn(async () => {
        throw new Error('Unhandled async exception');
      });
      const result = await throwingAsyncFn();
      expect(fx.isErr(result)).toBe(true);
      if (fx.isErr(result)) {
        expect(result[0]).toBeInstanceOf(UnhandledError);
        expect((result[0] as UnhandledError).originalError).toEqual(new Error('Unhandled async exception'));
      }
    });

    it('should work with async functions that take parameters', async () => {
      const asyncAddFn = fn(async (a: number, b: number) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        if (a < 0 || b < 0) {
          return fx.err(new Error('Negative numbers not allowed'));
        }
        return fx.ok(a + b);
      });

      const successResult = await asyncAddFn(2, 3);
      expect(successResult).toEqual([null, 5]);

      const errorResult = await asyncAddFn(-1, 3);
      expect(errorResult).toEqual([new Error('Negative numbers not allowed'), null]);
    });
  });
}); 