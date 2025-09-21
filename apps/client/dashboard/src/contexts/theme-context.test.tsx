import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTheme } from "./theme-context";

describe("useTheme", () => {
  it("throws error when used outside ThemeProvider", () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");
  });
});