import { renderHook } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useSettings } from "./use-settings";

describe("useSettings", () => {
  test("should throw an error if used outside of SettingsProvider", () => {
    expect(() => renderHook(() => useSettings())).toThrowError(
      "useSettings must be used within a SettingsProvider",
    );
  });
});
