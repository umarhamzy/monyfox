import { describe, expect, test } from "vitest";
import { notEmpty } from "./array";

describe("notEmpty", () => {
  test("should return true for non-null and non-undefined values", () => {
    expect(notEmpty(0)).toBe(true);
    expect(notEmpty("")).toBe(true);
    expect(notEmpty(false)).toBe(true);
  });

  test("should return false for null and undefined values", () => {
    expect(notEmpty(null)).toBe(false);
    expect(notEmpty(undefined)).toBe(false);
  });
});
