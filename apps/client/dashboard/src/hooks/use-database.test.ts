import { renderHook } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useDatabase } from "./use-database";

describe("useDatabase", () => {
  test("should throw an error if used outside of DatabaseProvider", () => {
    expect(() => renderHook(() => useDatabase())).toThrowError(
      "useDatabase must be used within a DatabaseProvider",
    );
  });
});
