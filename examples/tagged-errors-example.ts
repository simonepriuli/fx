import { ok, errTagged, catchByTag, catchByTags, fx } from "../src";

// Example: User registration pipeline with different error types

// Step 1: Validate user input
const validateUser = (userData: { email: string; password: string }) => {
  if (!userData.email) {
    return errTagged("VALIDATION_ERROR", "Email is required");
  }
  if (!userData.email.includes("@")) {
    return errTagged("VALIDATION_ERROR", "Invalid email format");
  }
  if (!userData.password) {
    return errTagged("VALIDATION_ERROR", "Password is required");
  }
  if (userData.password.length < 8) {
    return errTagged("VALIDATION_ERROR", "Password must be at least 8 characters");
  }
  return ok(userData);
};

// Step 2: Check if user already exists
const checkUserExists = async (email: string) => {
  // Simulate database check
  if (email === "existing@example.com") {
    return errTagged("USER_EXISTS_ERROR", "User already exists");
  }
  return ok(email);
};

// Step 3: Hash password
const hashPassword = (password: string) => {
  if (password === "weak") {
    return errTagged("SECURITY_ERROR", "Password is too weak");
  }
  return ok(`hashed_${password}`);
};

// Step 4: Save user to database
const saveUser = async (userData: { email: string; password: string }) => {
  // Simulate database save
  if (userData.email === "error@example.com") {
    return errTagged("DATABASE_ERROR", "Database connection failed");
  }
  return ok({ id: "user_123", ...userData });
};

// Main registration function with error handling
const registerUser = async (userData: { email: string; password: string }) => {
  // Step 1: Validate input
  const validationResult = validateUser(userData);
  
  // Handle validation errors
  const validatedUser = catchByTag(
    validationResult,
    "VALIDATION_ERROR",
    (error) => {
      console.log(`Validation failed: ${error}`);
      return errTagged("VALIDATION_ERROR", error); // Re-throw for now
    }
  );
  
  if (fx.isErr(validatedUser)) {
    return validatedUser;
  }
  
  // Step 2: Check if user exists
  const existsResult = await checkUserExists(validatedUser[1]!.email);
  
  // Handle user exists error
  const emailCheck = catchByTag(
    existsResult,
    "USER_EXISTS_ERROR",
    (error) => {
      console.log(`User exists: ${error}`);
      return errTagged("USER_EXISTS_ERROR", error);
    }
  );
  
  if (fx.isErr(emailCheck)) {
    return emailCheck;
  }
  
  // Step 3: Hash password
  const hashResult = hashPassword(validatedUser[1]!.password);
  
  // Handle security errors
  const hashedPassword = catchByTag(
    hashResult,
    "SECURITY_ERROR",
    (error) => {
      console.log(`Security issue: ${error}`);
      return errTagged("SECURITY_ERROR", error);
    }
  );
  
  if (fx.isErr(hashedPassword)) {
    return hashedPassword;
  }
  
  // Step 4: Save user
  const saveResult = await saveUser({
    email: validatedUser[1]!.email,
    password: hashedPassword[1]!
  });
  
  // Handle database errors
  const savedUser = catchByTag(
    saveResult,
    "DATABASE_ERROR",
    (error) => {
      console.log(`Database error: ${error}`);
      return errTagged("DATABASE_ERROR", error);
    }
  );
  
  return savedUser;
};

// Example usage
const main = async () => {
  console.log("=== User Registration Examples ===\n");
  
  // Success case
  console.log("1. Successful registration:");
  const successResult = await registerUser({
    email: "new@example.com",
    password: "securepassword123"
  });
  console.log("Result:", successResult);
  console.log();
  
  // Validation error
  console.log("2. Validation error:");
  const validationResult = await registerUser({
    email: "",
    password: "short"
  });
  console.log("Result:", validationResult);
  console.log();
  
  // User exists error
  console.log("3. User exists error:");
  const existsResult = await registerUser({
    email: "existing@example.com",
    password: "securepassword123"
  });
  console.log("Result:", existsResult);
  console.log();
  
  // Security error
  console.log("4. Security error:");
  const securityResult = await registerUser({
    email: "test@example.com",
    password: "weak"
  });
  console.log("Result:", securityResult);
  console.log();
  
  // Database error
  console.log("5. Database error:");
  const dbResult = await registerUser({
    email: "error@example.com",
    password: "securepassword123"
  });
  console.log("Result:", dbResult);
  console.log();
  
  // Example of catching multiple error types
  console.log("6. Catching multiple error types:");
  const multiCatchResult = await registerUser({
    email: "existing@example.com",
    password: "weak"
  });
  
  const handled = catchByTags(
    multiCatchResult,
    ["USER_EXISTS_ERROR", "SECURITY_ERROR"],
    (error) => {
      console.log(`Handled multiple errors: ${error}`);
      return ok("Error handled gracefully");
    }
  );
  console.log("Multi-catch result:", handled);
};
