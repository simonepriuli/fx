// Re-export types
export type { Result, ResultAsync } from "./types";

// Re-export error class
export { UnhandledError } from "./errors";

// Re-export utility functions
export { ok, err } from "./utils";

// Import functions
import { fn } from "./fn";
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
} from "./transform";
export { all, allAsync, any, zip, zip3, tryCatch, tryCatchAsync } from "./combinators";
export { fn } from "./fn";

// Main fx object with all methods
export const fx = {
  // Core methods
  ok: <const R>(success: R) => [null, success] as const,
  err: <const E>(error: E) => [error, null] as const,
  fn: fn,

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

  // Combinators
  all,
  allAsync,
  any,
  zip,
  zip3,
  tryCatch,
  tryCatchAsync,
};
