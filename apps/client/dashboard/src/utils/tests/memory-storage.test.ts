import { describe, test, expect, beforeEach } from "vitest";
import { MemoryStorage } from "./memory-storage";

describe("memoryStorage", () => {
  let memoryStorage: MemoryStorage;

  beforeEach(() => {
    memoryStorage = new MemoryStorage();
  });

  test("set and get an item", () => {
    memoryStorage.setItem("key", "value");
    expect(memoryStorage.getItem("key")).toBe("value");
  });

  test("return null for a non-existent item", () => {
    expect(memoryStorage.getItem("nonExistentKey")).toBeNull();
  });

  test("remove an item", () => {
    memoryStorage.setItem("key", "value");
    expect(memoryStorage.getItem("key")).not.toBeNull();
    memoryStorage.removeItem("key");
    expect(memoryStorage.getItem("key")).toBeNull();
  });

  test("clear all items", () => {
    memoryStorage.setItem("key1", "value1");
    memoryStorage.setItem("key2", "value2");
    expect(memoryStorage.length).toBe(2);
    memoryStorage.clear();
    expect(memoryStorage.getItem("key1")).toBeNull();
    expect(memoryStorage.getItem("key2")).toBeNull();
    expect(memoryStorage.length).toBe(0);
  });

  test("return the correct length", () => {
    memoryStorage.setItem("key1", "value1");
    memoryStorage.setItem("key2", "value2");
    expect(memoryStorage.length).toBe(2);
    memoryStorage.removeItem("key1");
    expect(memoryStorage.length).toBe(1);
  });

  test("return the correct key", () => {
    memoryStorage.setItem("key1", "value1");
    expect(memoryStorage.key(0)).toBe("key1");
    expect(memoryStorage.key(1)).toBeNull();
  });
});
