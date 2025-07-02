import { fx } from "../src/index";

describe('fx integration', () => {
  describe('basic operations', () => {
    it('should create success and error results', () => {
      const success = fx.ok(42);
      const error = fx.err(new Error('Failed'));

      expect(success).toEqual([null, 42]);
      expect(error).toEqual([new Error('Failed'), null]);
      expect(fx.isOk(success)).toBe(true);
      expect(fx.isErr(error)).toBe(true);
    });

    it('should transform results', () => {
      const result = fx.ok(5);
      const doubled = fx.map(result, (x) => x * 2);
      expect(doubled).toEqual([null, 10]);
    });

    it('should chain operations', () => {
      const result = fx.ok(5);
      const chained = fx.andThen(result, (x) => {
        if (x > 3) {
          return fx.ok(`Big number: ${x}`);
        }
        return fx.err(new Error('Number too small'));
      });
      expect(chained).toEqual([null, 'Big number: 5']);
    });
  });

  describe('combinators', () => {
    it('should combine multiple results', () => {
      const result1 = fx.ok(1);
      const result2 = fx.ok('hello');
      const result3 = fx.ok(true);

      const allResults = fx.all([result1, result2, result3]);
      expect(allResults).toEqual([null, [1, 'hello', true]]);

      const zipped = fx.zip(result1, result2);
      expect(zipped).toEqual([null, [1, 'hello']]);
    });

    it('should handle errors in combinators', () => {
      const result1 = fx.ok(1);
      const result2 = fx.err(new Error('Failed'));
      const result3 = fx.ok(true);

      const allResults = fx.all([result1, result2, result3]);
      expect(allResults).toEqual([new Error('Failed'), null]);
    });
  });

  describe('try-catch operations', () => {
    it('should handle successful operations', () => {
      const result = fx.tryCatch(() => 42);
      expect(result).toEqual([null, 42]);
    });

    it('should handle throwing operations', () => {
      const result = fx.tryCatch(() => {
        throw new Error('Something went wrong');
      });
      expect(result).toEqual([new Error('Something went wrong'), null]);
    });

    it('should handle async operations', async () => {
      const result = await fx.tryCatchAsync(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async result';
      });
      expect(result).toEqual([null, 'async result']);
    });
  });

  describe('function wrapping', () => {
    it('should wrap functions safely', () => {
      const safeFn = fx.fn(() => {
        const random = Math.random();
        if (random < 0.5) {
          return fx.ok(random);
        }
        return fx.err(new Error('Failed to generate random number'));
      });

      const result = safeFn();
      expect(fx.isOk(result) || fx.isErr(result)).toBe(true);
    });

    it('should wrap async functions safely', async () => {
      const safeAsyncFn = fx.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        const random = Math.random();
        if (random < 0.5) {
          return fx.ok(random);
        }
        return fx.err(new Error('Failed to generate random number'));
      });

      const result = await safeAsyncFn();
      expect(fx.isOk(result) || fx.isErr(result)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should provide fallback values', () => {
      const result = fx.err(new Error('Failed'));
      const fallback = fx.unwrapOr(result, 42);
      expect(fallback).toBe(42);
    });

    it('should compute fallback values', () => {
      const result = fx.err(new Error('Failed'));
      const fallback = fx.unwrapOrElse(result, (err) => err.message.length);
      expect(fallback).toBe(6);
    });

    it('should transform errors', () => {
      const result = fx.err(new Error('Original error'));
      const transformed = fx.mapError(result, (err) => `Transformed: ${err.message}`);
      expect(transformed).toEqual(['Transformed: Original error', null]);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle API-like operations', async () => {
      // Simulate API call
      const fetchUser = fx.fn(async (id: number) => {
        if (id <= 0) {
          return fx.err(new Error('Invalid user ID'));
        }
        if (id > 100) {
          return fx.err(new Error('User not found'));
        }
        await new Promise(resolve => setTimeout(resolve, 10));
        return fx.ok({ id, name: `User ${id}` });
      });

      // Success case
      const successResult = await fetchUser(1);
      expect(fx.isOk(successResult)).toBe(true);
      if (fx.isOk(successResult)) {
        expect(successResult[1]).toEqual({ id: 1, name: 'User 1' });
      }

      // Error case
      const errorResult = await fetchUser(0);
      expect(fx.isErr(errorResult)).toBe(true);
      if (fx.isErr(errorResult)) {
        expect(errorResult[0]).toEqual(new Error('Invalid user ID'));
      }
    });

    it('should handle data validation', () => {
      const validateAge = fx.fn((age: number) => {
        if (age < 0) {
          return fx.err(new Error('Age cannot be negative'));
        }
        if (age > 150) {
          return fx.err(new Error('Age seems unrealistic'));
        }
        return fx.ok(age);
      });

      const validateName = fx.fn((name: string) => {
        if (!name || name.trim().length === 0) {
          return fx.err(new Error('Name cannot be empty'));
        }
        if (name.length > 100) {
          return fx.err(new Error('Name too long'));
        }
        return fx.ok(name.trim());
      });

      // Combine validations
      const validateUser = (name: string, age: number) => {
        const nameResult = validateName(name);
        const ageResult = validateAge(age);

        return fx.all([nameResult, ageResult]);
      };

      const validUser = validateUser('John Doe', 30);
      expect(fx.isOk(validUser)).toBe(true);

      const invalidUser = validateUser('', -5);
      expect(fx.isErr(invalidUser)).toBe(true);
    });
  });
}); 