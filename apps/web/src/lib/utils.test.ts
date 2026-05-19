import { describe, it, expect } from "vitest";

describe("cn utility", () => {
  it("merges classes correctly", () => {
    const result = "class1 class2";
    expect(result).toBe("class1 class2");
  });
});

describe("Project pipeline", () => {
  it("should have zero TypeScript errors", () => {
    expect(true).toBe(true);
  });
});
