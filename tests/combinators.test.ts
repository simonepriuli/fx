import { fx } from '../src/index';
import { all, allAsync, any, zip, zip3, tryCatch, tryCatchAsync } from '../src/combinators';

describe('Combinators', () => {
  describe('all', () => {
    it('should combine all successful results', () => {
      const result1 = fx.ok(1);
      const result2 = fx.ok('hello');
      const result3 = fx.ok(true);
      
      const combined = all([result1, result2, result3]);
      expect(combined).toEqual([null, [1, 'hello', true]]);
    });

    it('should return first error if any result fails', () => {
      const result1 = fx.ok(1);
      const result2 = fx.err(new Error('Failed'));
      const result3 = fx.ok(true);
      
      const combined = all([result1, result2, result3]);
      expect(combined).toEqual([new Error('Failed'), null]);
    });

    it('should work with empty array', () => {
      const combined = all([]);
      expect(combined).toEqual([null, []]);
    });
  });

  describe('allAsync', () => {
    it('should combine all successful async results', async () => {
      const result1 = Promise.resolve(fx.ok(1));
      const result2 = Promise.resolve(fx.ok('hello'));
      const result3 = Promise.resolve(fx.ok(true));
      
      const combined = await allAsync([result1, result2, result3]);
      expect(combined).toEqual([null, [1, 'hello', true]]);
    });

    it('should return first error if any async result fails', async () => {
      const result1 = Promise.resolve(fx.ok(1));
      const result2 = Promise.resolve(fx.err(new Error('Failed')));
      const result3 = Promise.resolve(fx.ok(true));
      
      const combined = await allAsync([result1, result2, result3]);
      expect(combined).toEqual([new Error('Failed'), null]);
    });
  });

  describe('any', () => {
    it('should return first successful result', () => {
      const result1 = fx.err(new Error('Failed 1'));
      const result2 = fx.ok('success');
      const result3 = fx.err(new Error('Failed 2'));
      
      const combined = any([result1, result2, result3]);
      expect(combined).toEqual([null, 'success']);
    });

    it('should return last error if all results fail', () => {
      const result1 = fx.err(new Error('Failed 1'));
      const result2 = fx.err(new Error('Failed 2'));
      const result3 = fx.err(new Error('Failed 3'));
      
      const combined = any([result1, result2, result3]);
      expect(combined).toEqual([new Error('Failed 3'), null]);
    });

    it('should throw error for empty array', () => {
      expect(() => any([])).toThrow('Cannot call any() on empty array');
    });
  });

  describe('zip', () => {
    it('should zip two successful results', () => {
      const result1 = fx.ok(1);
      const result2 = fx.ok('hello');
      
      const zipped = zip(result1, result2);
      expect(zipped).toEqual([null, [1, 'hello']]);
    });

    it('should return first error if either result fails', () => {
      const result1 = fx.ok(1);
      const result2 = fx.err(new Error('Failed'));
      
      const zipped = zip(result1, result2);
      expect(zipped).toEqual([new Error('Failed'), null]);
    });

    it('should return first error when both fail', () => {
      const result1 = fx.err(new Error('Failed 1'));
      const result2 = fx.err(new Error('Failed 2'));
      
      const zipped = zip(result1, result2);
      expect(zipped).toEqual([new Error('Failed 1'), null]);
    });
  });

  describe('zip3', () => {
    it('should zip three successful results', () => {
      const result1 = fx.ok(1);
      const result2 = fx.ok('hello');
      const result3 = fx.ok(true);
      
      const zipped = zip3(result1, result2, result3);
      expect(zipped).toEqual([null, [1, 'hello', true]]);
    });

    it('should return first error if any result fails', () => {
      const result1 = fx.ok(1);
      const result2 = fx.err(new Error('Failed'));
      const result3 = fx.ok(true);
      
      const zipped = zip3(result1, result2, result3);
      expect(zipped).toEqual([new Error('Failed'), null]);
    });
  });

  describe('tryCatch', () => {
    it('should return success for successful function', () => {
      const result = tryCatch(() => 42);
      expect(result).toEqual([null, 42]);
    });

    it('should return error for throwing function', () => {
      const result = tryCatch(() => {
        throw new Error('Something went wrong');
      });
      expect(result).toEqual([new Error('Something went wrong'), null]);
    });

    it('should work with different return types', () => {
      const stringResult = tryCatch(() => 'hello');
      const objectResult = tryCatch(() => ({ key: 'value' }));
      
      expect(stringResult).toEqual([null, 'hello']);
      expect(objectResult).toEqual([null, { key: 'value' }]);
    });
  });

  describe('tryCatchAsync', () => {
    it('should return success for successful async function', async () => {
      const result = await tryCatchAsync(async () => 42);
      expect(result).toEqual([null, 42]);
    });

    it('should return error for rejecting async function', async () => {
      const result = await tryCatchAsync(async () => {
        throw new Error('Something went wrong');
      });
      expect(result).toEqual([new Error('Something went wrong'), null]);
    });

    it('should work with async operations', async () => {
      const result = await tryCatchAsync(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'delayed result';
      });
      expect(result).toEqual([null, 'delayed result']);
    });
  });
}); 