type Success<R> = readonly [null, R];
type Failure<E> = readonly [E, null];

export type Result<R, E> = Success<R> | Failure<E>;
export type ResultAsync<R, E> = Promise<Result<R, E>>;

// Tagged error type for error handling
export type TaggedError<Tag extends string, E> = {
  tag: Tag;
  error: E;
}; 