import { fx } from "./index";

// Basic usage
console.log("=== Basic Usage ===");
const mightFail = fx.fn(() => {
    const random = Math.random();
    if (random < 0.5) {
        return fx.ok(random);
    }
    return fx.err(new Error("Failed to generate random number"));
});

const result = mightFail();
console.log("Result:", result);
console.log("Is success:", fx.isOk(result));
console.log("Is error:", fx.isErr(result));

// Test async function
console.log("\n=== Async Function ===");
const mightFailAsync = fx.fn(async () => {
    const random = Math.random();
    if (random < 0.5) {
        return fx.ok(random);
    }
    return fx.err(new Error("Failed to generate random number"));
});

const asyncResult = await mightFailAsync();
console.log("Async Result:", asyncResult);

// Transformation examples
console.log("\n=== Transformations ===");
const successResult = fx.ok(42);
const doubled = fx.map(successResult, (x) => x * 2);
console.log("Original:", successResult);
console.log("Doubled:", doubled);

const chained = fx.andThen(successResult, (x) => {
    if (x > 40) {
        return fx.ok(`Big number: ${x}`);
    }
    return fx.err(new Error("Number too small"));
});
console.log("Chained:", chained);

// Combinators
console.log("\n=== Combinators ===");
const result1 = fx.ok(1);
const result2 = fx.ok("hello");
const result3 = fx.err(new Error("Something went wrong"));

const zipped = fx.zip(result1, result2);
console.log("Zipped success:", zipped);

const allResults = fx.all([result1, result2]);
console.log("All success:", allResults);

const anyResult = fx.all([result1, result3, result2]);
console.log("Any result:", anyResult);

// Try-catch
console.log("\n=== Try-Catch ===");
const safeDivision = fx.tryCatch(() => {
    const a = 10;
    const b = 0;
    if (b === 0) throw new Error("Division by zero");
    return a / b;
});
console.log("Safe division:", safeDivision);

const safeJSON = fx.tryCatch(() => {
    return JSON.parse('{"valid": "json"}');
});
console.log("Safe JSON:", safeJSON);