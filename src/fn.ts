import { Result, ResultAsync } from "./types";
import { UnhandledError } from "./errors";
import { err } from "./utils";

// Function overloads for fn
export function fn<A extends any[], E, R>(
  fn: (...args: A) => Result<E, R>
): (...args: A) => Result<E | UnhandledError, R>;
export function fn<A extends any[], E, R>(
  fn: (...args: A) => ResultAsync<E, R>
): (...args: A) => ResultAsync<E | UnhandledError, R>;
export function fn<A extends any[], E, R>(
  fn: (...args: A) => Result<E, R> | ResultAsync<E, R>
): (
  ...args: A
) => Result<E | UnhandledError, R> | ResultAsync<E | UnhandledError, R> {
  return (
    ...args: A
  ): Result<E | UnhandledError, R> | ResultAsync<E | UnhandledError, R> => {
    try {
      const result = fn(...args);

      // Check if the result is a Promise (async function)
      if (result instanceof Promise) {
        return result.catch(
          (error) =>
            err(new UnhandledError(error)) as Result<E | UnhandledError, R>
        ) as ResultAsync<E | UnhandledError, R>;
      }

      // Sync function
      return result as Result<E | UnhandledError, R>;
    } catch (error) {
      return err(new UnhandledError(error)) as Result<E | UnhandledError, R>;
    }
  };
} 