import { Result, ResultAsync } from "./types";
import { ok, err } from "./utils";

/**
 * Combine multiple Results into one
 * Returns success only if all Results are successful
 */
export function all<R extends readonly unknown[], E>(
  results: { [K in keyof R]: Result<R[K], E> }
): Result<R, E> {
  const values = [] as unknown as R;
  
  for (let i = 0; i < results.length; i++) {
    const [error, value] = results[i];
    if (error !== null) return err(error);
    (values as any)[i] = value!;
  }
  
  return ok(values);
}

/**
 * Combine multiple async Results into one
 */
export function allAsync<R extends readonly unknown[], E>(
  results: { [K in keyof R]: ResultAsync<R[K], E> }
): ResultAsync<R, E> {
  return Promise.all(results).then((resolvedResults) => all(resolvedResults as any));
}

/**
 * Return the first successful Result, or the last error if all fail
 */
export function any<R, E>(results: Result<R, E>[]): Result<R, E> {
  if (results.length === 0) {
    throw new Error("Cannot call any() on empty array");
  }
  
  let lastError: E | null = null;
  
  for (const result of results) {
    const [error, value] = result;
    if (error === null) return ok(value!);
    lastError = error;
  }
  
  return err(lastError!);
}

/**
 * Zip two Results together
 */
export function zip<R1, R2, E>(
  result1: Result<R1, E>,
  result2: Result<R2, E>
): Result<[R1, R2], E> {
  const [error1, value1] = result1;
  if (error1 !== null) return err(error1);
  
  const [error2, value2] = result2;
  if (error2 !== null) return err(error2);
  
  return ok([value1!, value2!]);
}

/**
 * Zip three Results together
 */
export function zip3<R1, R2, R3, E>(
  result1: Result<R1, E>,
  result2: Result<R2, E>,
  result3: Result<R3, E>
): Result<[R1, R2, R3], E> {
  const [error1, value1] = result1;
  if (error1 !== null) return err(error1);
  
  const [error2, value2] = result2;
  if (error2 !== null) return err(error2);
  
  const [error3, value3] = result3;
  if (error3 !== null) return err(error3);
  
  return ok([value1!, value2!, value3!]);
}

/**
 * Try to execute a function and return a Result
 */
export function tryCatch<R, E = Error>(
  fn: () => R
): Result<R, E> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error as E);
  }
}

/**
 * Try to execute an async function and return a ResultAsync
 */
export function tryCatchAsync<R, E = Error>(
  fn: () => Promise<R>
): ResultAsync<R, E> {
  return fn()
    .then((value) => ok(value))
    .catch((error) => err(error as E));
} 