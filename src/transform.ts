import { Result, ResultAsync } from "./types";
import { ok, err } from "./utils";

/**
 * Transform the success value of a Result
 */
export function map<R, E, T>(
  result: Result<R, E>,
  fn: (value: R) => T
): Result<T, E> {
  const [error, value] = result;
  if (error !== null) return err(error);
  return ok(fn(value!));
}

/**
 * Transform the success value of a Result with an async function
 */
export function mapAsync<R, E, T>(
  result: Result<R, E>,
  fn: (value: R) => Promise<T>
): ResultAsync<T, E> {
  const [error, value] = result;
  if (error !== null) return Promise.resolve(err(error));
  return fn(value!).then((newValue) => ok(newValue));
}

/**
 * Chain operations on a Result (flatMap)
 */
export function andThen<R, E, T>(
  result: Result<R, E>,
  fn: (value: R) => Result<T, E>
): Result<T, E> {
  const [error, value] = result;
  if (error !== null) return err(error);
  return fn(value!);
}

/**
 * Chain operations on a Result with an async function
 */
export function andThenAsync<R, E, T>(
  result: Result<R, E>,
  fn: (value: R) => ResultAsync<T, E>
): ResultAsync<T, E> {
  const [error, value] = result;
  if (error !== null) return Promise.resolve(err(error));
  return fn(value!);
}

/**
 * Handle errors by transforming them
 */
export function mapError<R, E, F>(
  result: Result<R, E>,
  fn: (error: E) => F
): Result<R, F> {
  const [error, value] = result;
  if (error === null) return ok(value!);
  return err(fn(error));
}

/**
 * Provide a fallback value when Result is an error
 */
export function orElse<R, E, T>(
  result: Result<R, E>,
  fn: (error: E) => Result<T, E>
): Result<R | T, E> {
  const [error, value] = result;
  if (error === null) return ok(value!);
  return fn(error);
}

/**
 * Unwrap the value or throw an error
 */
export function unwrap<R, E>(result: Result<R, E>): R {
  const [error, value] = result;
  if (error !== null) throw error;
  return value!;
}

/**
 * Unwrap the value or return a default
 */
export function unwrapOr<R, E>(result: Result<R, E>, defaultValue: R): R {
  const [error, value] = result;
  if (error !== null) return defaultValue;
  return value!;
}

/**
 * Unwrap the value or compute a default
 */
export function unwrapOrElse<R, E>(result: Result<R, E>, fn: (error: E) => R): R {
  const [error, value] = result;
  if (error !== null) return fn(error);
  return value!;
}

/**
 * Check if Result is success
 */
export function isOk<R, E>(result: Result<R, E>): result is [null, R] {
  return result[0] === null;
}

/**
 * Check if Result is error
 */
export function isErr<R, E>(result: Result<R, E>): result is [E, null] {
  return result[0] !== null;
} 