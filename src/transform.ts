import { Result, ResultAsync, TaggedError } from "./types";
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

/**
 * Catch errors by tag and handle them with a specific function
 */
export function catchByTag<R, E, Tag extends string, T>(
  result: Result<R, TaggedError<Tag, E>>,
  tag: Tag,
  handler: (error: E) => Result<T, TaggedError<Tag, E>>
): Result<R | T, TaggedError<Tag, E>> {
  const [error, value] = result;
  if (error === null) return ok(value!);
  
  if (error.tag === tag) {
    return handler(error.error);
  }
  
  return err(error);
}

/**
 * Catch errors by tag and handle them with an async function
 */
export function catchByTagAsync<R, E, Tag extends string, T>(
  result: Result<R, TaggedError<Tag, E>>,
  tag: Tag,
  handler: (error: E) => ResultAsync<T, TaggedError<Tag, E>>
): ResultAsync<R | T, TaggedError<Tag, E>> {
  const [error, value] = result;
  if (error === null) return Promise.resolve(ok(value!));
  
  if (error.tag === tag) {
    return handler(error.error);
  }
  
  return Promise.resolve(err(error));
}

/**
 * Catch multiple error tags with a single handler
 */
export function catchByTags<R, E, Tags extends readonly string[], T>(
  result: Result<R, TaggedError<Tags[number], E>>,
  tags: Tags,
  handler: (error: E) => Result<T, TaggedError<Tags[number], E>>
): Result<R | T, TaggedError<Tags[number], E>> {
  const [error, value] = result;
  if (error === null) return ok(value!);
  
  if (tags.includes(error.tag)) {
    return handler(error.error);
  }
  
  return err(error);
}

/**
 * Catch multiple error tags with an async handler
 */
export function catchByTagsAsync<R, E, Tags extends readonly string[], T>(
  result: Result<R, TaggedError<Tags[number], E>>,
  tags: Tags,
  handler: (error: E) => ResultAsync<T, TaggedError<Tags[number], E>>
): ResultAsync<R | T, TaggedError<Tags[number], E>> {
  const [error, value] = result;
  if (error === null) return Promise.resolve(ok(value!));
  
  if (tags.includes(error.tag)) {
    return handler(error.error);
  }
  
  return Promise.resolve(err(error));
}

/**
 * Check if an error has a specific tag
 */
export function hasTag<E, Tag extends string>(
  error: TaggedError<string, E>,
  tag: Tag
): error is TaggedError<Tag, E> {
  return error.tag === tag;
} 