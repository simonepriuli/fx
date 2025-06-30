export class UnhandledError extends Error {
  originalError: unknown;
  constructor(originalError: unknown) {
    super("Unhandled error");
    this.originalError = originalError;
    this.name = "UnhandledError";
  }
} 