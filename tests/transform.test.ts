import { fx } from "../src/index";
import {
  map,
  mapAsync,
  andThen,
  andThenAsync,
  mapError,
  orElse,
  unwrap,
  unwrapOr,
  unwrapOrElse,
  isOk,
  isErr,
} from "../src/transform";

describe("Transform", () => {
  describe("map", () => {
    it("should transform success values", () => {
      const result = fx.ok(5);
      const doubled = map(result, (x) => x! * 2);
      expect(doubled).toEqual([null, 10]);
    });

    it("should preserve errors", () => {
      const error = new Error("Failed");
      const result = fx.err(error);
      const mapped = map(result, (x) => x! * 2);
      expect(mapped).toEqual([error, null]);
    });

    it("should work with different transformation types", () => {
      const result = fx.ok("hello");
      const length = map(result, (str) => str.length);
      const upper = map(result, (str) => str.toUpperCase());

      expect(length).toEqual([null, 5]);
      expect(upper).toEqual([null, "HELLO"]);
    });
  });

  describe("mapAsync", () => {
    it("should transform success values asynchronously", async () => {
      const result = fx.ok(5);
      const doubled = await mapAsync(result, async (x) => x! * 2);
      expect(doubled).toEqual([null, 10]);
    });

    it("should preserve errors in async operations", async () => {
      const error = new Error("Failed");
      const result = fx.err(error);
      const mapped = await mapAsync(result, async (x) => x! * 2);
      expect(mapped).toEqual([error, null]);
    });
  });

  describe("andThen", () => {
    it("should chain operations", () => {
      const result = fx.ok(5);
      const chained = andThen(result, (x) => {
        if (x! > 3) {
          return fx.ok(`Big number: ${x}`);
        }
        return fx.err(new Error("Number too small"));
      });
      expect(chained).toEqual([null, "Big number: 5"]);
    });

    it("should propagate errors from chained operations", () => {
      const result = fx.ok(2);
      const chained = andThen(result, (x) => {
        if (x > 3) {
          return fx.ok(`Big number: ${x}`);
        }
        return fx.err(new Error("Number too small"));
      });
      expect(chained).toEqual([new Error("Number too small"), null]);
    });

    it("should preserve original errors", () => {
      const error = new Error("Original error");
      const result = fx.err(error);
      const chained = andThen(result, (x) => fx.ok(x! * 2));
      expect(chained).toEqual([error, null]);
    });
  });

  describe("andThenAsync", () => {
    it("should chain async operations", async () => {
      const result = fx.ok(5);
      const chained = await andThenAsync(result, async (x) => {
        if (x > 3) {
          return fx.ok(`Big number: ${x}`);
        }
        return fx.err(new Error("Number too small"));
      });
      expect(chained).toEqual([null, "Big number: 5"]);
    });
  });

  describe("mapError", () => {
    it("should transform errors", () => {
      const error = new Error("Original error");
      const result = fx.err(error);
      const mapped = mapError(result, (err) => `Transformed: ${err!.message}`);
      expect(mapped).toEqual(["Transformed: Original error", null]);
    });

    it("should preserve success values", () => {
      const result = fx.ok(42);
      const mapped = mapError(result, (err) => `Transformed: ${err}`);
      expect(mapped).toEqual([null, 42]);
    });
  });

  describe("orElse", () => {
    it("should provide fallback for errors", () => {
      const error = new Error("Failed");
      const result = fx.err(error);
      const fallback = orElse(result, (err) =>
        fx.ok(`Recovered from: ${err.message}`)
      );
      expect(fallback).toEqual([null, "Recovered from: Failed"]);
    });

    it("should preserve success values", () => {
      const result = fx.ok(42);
      const fallback = orElse(result, (err) => fx.ok("fallback"));
      expect(fallback).toEqual([null, 42]);
    });
  });

  describe("unwrap", () => {
    it("should return success value", () => {
      const result = fx.ok(42);
      expect(unwrap(result)).toBe(42);
    });

    it("should throw error for failure", () => {
      const error = new Error("Failed");
      const result = fx.err(error);
      expect(() => unwrap(result)).toThrow(error);
    });
  });

  describe("unwrapOr", () => {
    it("should return success value", () => {
      const result = fx.ok(42);
      expect(unwrapOr(result, 0)).toBe(42);
    });

    it("should return default for error", () => {
      const error = new Error("Failed");
      const result = fx.err(error);
      expect(unwrapOr(result, 0)).toBe(0);
    });
  });

  describe("unwrapOrElse", () => {
    it("should compute default for error", () => {
      const error = new Error("Failed");
      const result = fx.err(error);
      expect(unwrapOrElse(result, (err) => err!.message.length)).toBe(6);
    });
  });

  describe("isOk", () => {
    it("should return true for success", () => {
      const result = fx.ok(42);
      expect(isOk(result)).toBe(true);
    });

    it("should return false for error", () => {
      const result = fx.err(new Error("Failed"));
      expect(isOk(result)).toBe(false);
    });
  });

  describe("isErr", () => {
    it("should return true for error", () => {
      const result = fx.err(new Error("Failed"));
      expect(isErr(result)).toBe(true);
    });

    it("should return false for success", () => {
      const result = fx.ok(42);
      expect(isErr(result)).toBe(false);
    });
  });
});
