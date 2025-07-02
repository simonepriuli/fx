// Re-export types
export type { Result, ResultAsync, TaggedError } from "./types";

// Re-export error class
export { UnhandledError } from "./errors";

// Re-export utility functions
export { ok, err, tagError, errTagged } from "./utils";

// Import functions
import { fn } from "./fn";
import { tagError, errTagged } from "./utils";
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
  catchByTag,
  catchByTagAsync,
  catchByTags,
  catchByTagsAsync,
  hasTag,
} from "./transform";
import {
  all,
  allAsync,
  any,
  zip,
  zip3,
  tryCatch,
  tryCatchAsync,
} from "./combinators";

// Re-export all functions for direct import
export {
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
  catchByTag,
  catchByTagAsync,
  catchByTags,
  catchByTagsAsync,
  hasTag,
} from "./transform";
export { all, allAsync, any, zip, zip3, tryCatch, tryCatchAsync } from "./combinators";
export { fn } from "./fn";

// Main fx object with all methods
export const fx = {
  // Core methods
  ok: <const R>(success: R) => [null, success] as const,
  err: <const E>(error: E) => [error, null] as const,
  fn: fn,

  // Error tagging utilities
  tagError,
  errTagged,

  // Transformations
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

  // Error catching
  catchByTag,
  catchByTagAsync,
  catchByTags,
  catchByTagsAsync,
  hasTag,

  // Combinators
  all,
  allAsync,
  any,
  zip,
  zip3,
  tryCatch,
  tryCatchAsync,
};
