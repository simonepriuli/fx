import { ok, errTagged, catchByTag, catchByTags, hasTag, fx } from "../src";

describe("Tagged Errors", () => {
  describe("Basic tagging", () => {
    it("should create tagged errors", () => {
      const taggedError = fx.tagError("VALIDATION_ERROR", "Invalid input");
      expect(taggedError).toEqual({
        tag: "VALIDATION_ERROR",
        error: "Invalid input"
      });
    });

    it("should create results with tagged errors", () => {
      const result = errTagged("NETWORK_ERROR", "Connection failed");
      expect(result).toEqual([
        { tag: "NETWORK_ERROR", error: "Connection failed" },
        null
      ]);
    });
  });

  describe("Error catching", () => {
    it("should catch errors by specific tag", () => {
      const result = errTagged("VALIDATION_ERROR", "Invalid email");
      
      const handled = catchByTag(
        result,
        "VALIDATION_ERROR",
        (error) => ok(`Handled: ${error}`)
      );
      
      expect(handled).toEqual([null, "Handled: Invalid email"]);
    });

    it("should not catch errors with different tags", () => {
      const result = errTagged("NETWORK_ERROR", "Connection failed");
      
      const handled = catchByTag(
        result,
        "VALIDATION_ERROR",
        (error) => ok(`Handled: ${error}`)
      );
      
      expect(handled).toEqual([
        { tag: "NETWORK_ERROR", error: "Connection failed" },
        null
      ]);
    });

    it("should pass through success results", () => {
      const result = ok("success");
      
      const handled = catchByTag(
        result,
        "VALIDATION_ERROR",
        (error) => ok(`Handled: ${error}`)
      );
      
      expect(handled).toEqual([null, "success"]);
    });
  });

  describe("Multiple tag catching", () => {
    it("should catch errors with any of the specified tags", () => {
      const result = errTagged("NETWORK_ERROR", "Connection failed");
      
      const handled = catchByTags(
        result,
        ["VALIDATION_ERROR", "NETWORK_ERROR"],
        (error) => ok(`Handled: ${error}`)
      );
      
      expect(handled).toEqual([null, "Handled: Connection failed"]);
    });

    it("should not catch errors with different tags", () => {
      const result = errTagged("DATABASE_ERROR", "Query failed");
      
      const handled = catchByTags(
        result,
        ["VALIDATION_ERROR", "NETWORK_ERROR"],
        (error) => ok(`Handled: ${error}`)
      );
      
      expect(handled).toEqual([
        { tag: "DATABASE_ERROR", error: "Query failed" },
        null
      ]);
    });
  });

  describe("Tag checking", () => {
    it("should check if error has specific tag", () => {
      const taggedError = fx.tagError("VALIDATION_ERROR", "Invalid input");
      
      expect(hasTag(taggedError, "VALIDATION_ERROR")).toBe(true);
      expect(hasTag(taggedError, "NETWORK_ERROR")).toBe(false);
    });
  });

  describe("Pipeline example", () => {
    it("should handle different error types in a pipeline", () => {
      // Simulate a pipeline that can fail with different error types
      const validateInput = (input: string) => {
        if (!input) return errTagged("VALIDATION_ERROR", "Input is required");
        if (input.length < 3) return errTagged("VALIDATION_ERROR", "Input too short");
        return ok(input);
      };

      const processData = (input: string) => {
        if (input === "error") return errTagged("PROCESSING_ERROR", "Failed to process");
        return ok(input.toUpperCase());
      };

      const saveData = (data: string) => {
        if (data === "ERROR") return errTagged("DATABASE_ERROR", "Failed to save");
        return ok(`Saved: ${data}`);
      };

      // Test successful pipeline
      const step1 = validateInput("hello");
      const step2 = processData(fx.unwrap(step1));
      const successResult = saveData(fx.unwrap(step2));

      expect(successResult).toEqual([null, "Saved: HELLO"]);

      // Test validation error
      const valStep1 = validateInput("");
      const valStep2 = catchByTag(valStep1, "VALIDATION_ERROR", (error) => ok(`Validation failed: ${error}`));
      const valStep3 = processData(fx.unwrap(valStep2));
      const validationResult = saveData(fx.unwrap(valStep3));

      expect(validationResult).toEqual([null, "Saved: VALIDATION FAILED: INPUT IS REQUIRED"]);

      // Test processing error
      const procStep1 = validateInput("error");
      const procStep2 = processData(fx.unwrap(procStep1));
      const procStep3 = catchByTag(procStep2, "PROCESSING_ERROR", (error) => ok(`Processing failed: ${error}`));
      const processingResult = saveData(fx.unwrap(procStep3));

      expect(processingResult).toEqual([null, "Saved: Processing failed: Failed to process"]);
    });
  });
}); 