import { renderHook } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useProfile } from "./use-profile";

describe("useProfile", () => {
  test("should throw an error if used outside of ProfileProvider", () => {
    expect(() => renderHook(() => useProfile())).toThrowError(
      "useProfile must be used within a ProfileProvider",
    );
  });
});
