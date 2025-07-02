import { ok, err } from "../src/utils";
import { fx } from "../src/index";

describe('Utils', () => {
  describe('ok', () => {
    it('should create a success result', () => {
      const result = ok(42);
      expect(result).toEqual([null, 42]);
      expect(fx.isOk(result)).toBe(true);
      expect(fx.isErr(result)).toBe(false);
    });

    it('should work with different types', () => {
      const stringResult = ok('hello');
      const objectResult = ok({ key: 'value' });
      const arrayResult = ok([1, 2, 3]);

      expect(stringResult).toEqual([null, 'hello']);
      expect(objectResult).toEqual([null, { key: 'value' }]);
      expect(arrayResult).toEqual([null, [1, 2, 3]]);
    });
  });

  describe('err', () => {
    it('should create an error result', () => {
      const error = new Error('Something went wrong');
      const result = err(error);
      expect(result).toEqual([error, null]);
      expect(fx.isOk(result)).toBe(false);
      expect(fx.isErr(result)).toBe(true);
    });

    it('should work with different error types', () => {
      const stringError = err('string error');
      const numberError = err(404);
      const objectError = err({ code: 500, message: 'Server error' });

      expect(stringError).toEqual(['string error', null]);
      expect(numberError).toEqual([404, null]);
      expect(objectError).toEqual([{ code: 500, message: 'Server error' }, null]);
    });
  });
}); 