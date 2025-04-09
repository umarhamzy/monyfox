import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { useStorage } from "../use-storage";
import { z } from "zod";

const storage: Storage = (() => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => {
      return store.get(key) || null;
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    clear: () => {
      store.clear();
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    key: (index: number) => {
      return Array.from(store.keys())[index] || null;
    },
    length: store.size,
  };
})();

describe("useStorage", () => {
  const key = "testKey";
  const defaultValue = { name: "John Doe" };
  const schema = z.object({ name: z.string() });

  beforeEach(() => {
    storage.clear();
  });

  test("should initialize with default value if no value in storage", () => {
    const { result } = renderHook(() =>
      useStorage(storage, key, defaultValue, schema),
    );
    expect(result.current[0]).toEqual(defaultValue);
  });

  test("should initialize with value from storage if available", () => {
    const storedValue = { name: "Jane Doe" };
    storage.setItem(key, JSON.stringify(storedValue));
    const { result } = renderHook(() =>
      useStorage(storage, key, defaultValue, schema),
    );
    expect(result.current[0]).toEqual(storedValue);
  });

  test("should update storage when value changes", () => {
    const { result } = renderHook(() =>
      useStorage(storage, key, defaultValue, schema),
    );
    const newValue = { name: "Jane Doe" };
    act(() => {
      result.current[1](newValue);
    });
    expect(storage.getItem(key)).toEqual(JSON.stringify(newValue));
  });

  test("should return null if stored value is invalid", () => {
    storage.setItem(key, JSON.stringify({ name: 123 }));
    const { result } = renderHook(() =>
      useStorage(storage, key, defaultValue, schema),
    );
    expect(result.current[0]).toBeNull();
  });
});
