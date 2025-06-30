# fx - Functional Result Type Library

A lightweight, type-safe Result type library for TypeScript that provides a functional approach to error handling.

## Features

- 🎯 **Type-safe error handling** with Result types
- ⚡ **Async support** with ResultAsync
- 🔧 **Functional transformations** (map, flatMap, andThen)
- 🎲 **Combinators** for working with multiple Results
- 🛡️ **Safe execution** with tryCatch utilities
- 📦 **Zero dependencies** - pure TypeScript

## Installation

```bash
npm install @fx-ts/fx
```

## Quick Start

```typescript
import { fx } from 'fx';

// Create a function that might fail
const divide = fx.fn((a: number, b: number) => {
  if (b === 0) {
    return fx.err(new Error('Division by zero'));
  }
  return fx.ok(a / b);
});

// Use the function
const result = divide(10, 2);
// result: [null, 5] (success)

const errorResult = divide(10, 0);
// errorResult: [Error: Division by zero, null] (error)

// Transform results
const doubled = fx.map(result, x => x * 2);
// doubled: [null, 10]

// Chain operations
const chained = fx.andThen(result, x => {
  if (x > 3) {
    return fx.ok(`Big number: ${x}`);
  }
  return fx.err(new Error('Number too small'));
});
// chained: [null, "Big number: 5"]
```

## Core Concepts

### Result Type

A Result is a tuple `[error, value]` where:
- `[null, value]` represents success
- `[error, null]` represents failure

```typescript
type Result<R, E> = [null, R] | [E, null];
type ResultAsync<R, E> = Promise<Result<R, E>>;
```

### Creating Results

```typescript
import { fx } from 'fx';

// Success
const success = fx.ok(42);
// [null, 42]

// Error
const error = fx.err(new Error('Something went wrong'));
// [Error: Something went wrong, null]
```

### Safe Function Execution

```typescript
import { fx } from 'fx';

// Wrap any function (sync or async)
const safeFunction = fx.fn(() => {
  // This function might throw
  const random = Math.random();
  if (random < 0.5) {
    throw new Error('Random failure');
  }
  return random;
});

const result = safeFunction();
// Always returns a Result, never throws
```

## API Reference

### Core Functions

#### `fx.ok(value)`
Creates a success Result.

#### `fx.err(error)`
Creates an error Result.

#### `fx.fn(function)`
Wraps a function to return Results instead of throwing.

### Transformations

#### `fx.map(result, fn)`
Transform the success value of a Result.

```typescript
const result = fx.ok(5);
const doubled = fx.map(result, x => x * 2);
// [null, 10]
```

#### `fx.andThen(result, fn)`
Chain operations on a Result (flatMap).

```typescript
const result = fx.ok(5);
const chained = fx.andThen(result, x => {
  if (x > 3) return fx.ok(x * 2);
  return fx.err(new Error('Too small'));
});
```

#### `fx.mapError(result, fn)`
Transform the error of a Result.

```typescript
const result = fx.err(new Error('Original error'));
const transformed = fx.mapError(result, err => `Custom: ${err.message}`);
// ["Custom: Original error", null]
```

#### `fx.orElse(result, fn)`
Provide a fallback when Result is an error.

```typescript
const result = fx.err(new Error('Failed'));
const fallback = fx.orElse(result, err => fx.ok('Default value'));
// [null, "Default value"]
```

### Unwrapping

#### `fx.unwrap(result)`
Extract the value or throw the error.

```typescript
const result = fx.ok(42);
const value = fx.unwrap(result); // 42

const errorResult = fx.err(new Error('Oops'));
const value = fx.unwrap(errorResult); // throws Error: Oops
```

#### `fx.unwrapOr(result, defaultValue)`
Extract the value or return a default.

```typescript
const result = fx.err(new Error('Failed'));
const value = fx.unwrapOr(result, 0); // 0
```

#### `fx.unwrapOrElse(result, fn)`
Extract the value or compute a default.

```typescript
const result = fx.err(new Error('Failed'));
const value = fx.unwrapOrElse(result, err => err.message.length); // 6
```

### Type Guards

#### `fx.isOk(result)`
Check if Result is success.

#### `fx.isErr(result)`
Check if Result is error.

### Combinators

#### `fx.all(results)`
Combine multiple Results. Returns success only if all are successful.

```typescript
const results = [fx.ok(1), fx.ok(2), fx.ok(3)];
const combined = fx.all(results);
// [null, [1, 2, 3]]
```

#### `fx.any(results)`
Return the first successful Result, or the last error if all fail.

#### `fx.zip(result1, result2)`
Combine two Results into a tuple.

```typescript
const result1 = fx.ok(1);
const result2 = fx.ok('hello');
const zipped = fx.zip(result1, result2);
// [null, [1, "hello"]]
```

#### `fx.tryCatch(fn)`
Execute a function and return a Result.

```typescript
const result = fx.tryCatch(() => {
  const value = JSON.parse('invalid json');
  return value;
});
// [SyntaxError: Unexpected token i in JSON at position 0, null]
```

## Async Support

All functions work with async Results:

```typescript
import { fx } from 'fx';

const asyncResult = fx.fn(async () => {
  const response = await fetch('/api/data');
  if (!response.ok) {
    return fx.err(new Error('API failed'));
  }
  return fx.ok(await response.json());
});

const transformed = await fx.mapAsync(asyncResult(), data => data.name);
```

## Best Practices

1. **Use Results for expected errors** - Don't use Results for unexpected errors (bugs)
2. **Chain operations** - Use `fx.andThen` to build complex workflows
3. **Handle errors explicitly** - Use `fx.mapError` and `fx.orElse` to handle errors gracefully
4. **Use combinators** - Use `fx.all`, `fx.zip` for working with multiple Results
5. **Prefer unwrapOr over unwrap** - Avoid throwing in production code

## Examples

### API Call with Error Handling

```typescript
import { fx } from 'fx';

const fetchUser = fx.fn(async (id: number) => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    return fx.err(new Error(`HTTP ${response.status}`));
  }
  return fx.ok(await response.json());
});

const getUserName = fx.andThen(fetchUser(123), user => {
  if (!user.name) {
    return fx.err(new Error('User has no name'));
  }
  return fx.ok(user.name);
});

const result = await getUserName();
```

### Validation Pipeline

```typescript
import { fx } from 'fx';

const validateEmail = (email: string) => {
  if (!email.includes('@')) {
    return fx.err(new Error('Invalid email'));
  }
  return fx.ok(email);
};

const validateAge = (age: number) => {
  if (age < 18) {
    return fx.err(new Error('Too young'));
  }
  return fx.ok(age);
};

const validateUser = (email: string, age: number) => {
  const emailResult = validateEmail(email);
  const ageResult = validateAge(age);
  
  return fx.all([emailResult, ageResult]);
};

const result = validateUser('user@example.com', 25);
// [null, ["user@example.com", 25]]
```

## License

MIT 