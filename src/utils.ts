import { Result } from "./types";

export const ok = <const R>(success: R): Result<R, never> => [null, success];
export const err = <const E>(error: E): Result<never, E> => [error, null]; 