import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, beforeEach, beforeAll } from "vitest";
import { useAnalytics } from "./use-analytics";
import { MemoryStorage } from "../utils/tests/memory-storage";

const memoryStorage = new MemoryStorage();

beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: memoryStorage,
    writable: true,
  });
});

beforeEach(() => {
  memoryStorage.clear();
});

describe("useAnalytics", () => {
  test("should initialize with default value", () => {
    const { result } = renderHook(() => useAnalytics());
    expect(result.current.isTracking).toBe(true);
  });

  test("should toggle tracking correctly", () => {
    const { result } = renderHook(() => useAnalytics());
    act(() => {
      result.current.toggleTracking();
    });
    expect(result.current.isTracking).toBe(false);
    act(() => {
      result.current.toggleTracking();
    });
    expect(result.current.isTracking).toBe(true);
  });
});