import { Result, TaggedError } from "./types";

export const ok = <const R>(success: R): Result<R, never> => [null, success];
export const err = <const E>(error: E): Result<never, E> => [error, null];

/**
 * Create a tagged error
 */
export const tagError = <Tag extends string, E>(tag: Tag, error: E): TaggedError<Tag, E> => ({
  tag,
  error,
});

/**
 * Create a Result with a tagged error
 */
export const errTagged = <Tag extends string, E>(tag: Tag, error: E): Result<never, TaggedError<Tag, E>> => 
  err(tagError(tag, error)); 