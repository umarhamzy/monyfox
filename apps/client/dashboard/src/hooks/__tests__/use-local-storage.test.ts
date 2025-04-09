import { renderHook, act } from "@testing-library/react";
import {
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import { useLocalStorage } from "../use-local-storage";
import { z } from "zod";
import { MemoryStorage } from "../../utils/tests/memory-storage";

const originalLocalStorage = window.localStorage;
const memoryStorage = new MemoryStorage();

beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: memoryStorage,
    writable: true,
  });
});

afterAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: originalLocalStorage,
    writable: true,
  });
});

describe("useLocalStorage", () => {
  const key = "testKey";
  const defaultValue = { name: "John Doe" };
  const schema = z.object({ name: z.string() });

  beforeEach(() => {
    memoryStorage.clear();
  });

  test("should initialize with default value if no value in storage", () => {
    const { result } = renderHook(() =>
      useLocalStorage(key, defaultValue, schema),
    );
    expect(result.current[0]).toEqual(defaultValue);
  });

  test("should initialize with value from storage if available", () => {
    const storedValue = { name: "Jane Doe" };
    memoryStorage.setItem(key, JSON.stringify(storedValue));
    const { result } = renderHook(() =>
      useLocalStorage(key, defaultValue, schema),
    );
    expect(result.current[0]).toEqual(storedValue);
  });

  test("should update storage when value changes", () => {
    const { result } = renderHook(() =>
      useLocalStorage(key, defaultValue, schema),
    );
    const newValue = { name: "Jane Doe" };
    act(() => {
      result.current[1](newValue);
    });
    expect(memoryStorage.getItem(key)).toEqual(JSON.stringify(newValue));
  });

  test("should return null if stored value is invalid", () => {
    memoryStorage.setItem(key, JSON.stringify({ name: 123 }));
    const { result } = renderHook(() =>
      useLocalStorage(key, defaultValue, schema),
    );
    expect(result.current[0]).toBeNull();
  });
});
