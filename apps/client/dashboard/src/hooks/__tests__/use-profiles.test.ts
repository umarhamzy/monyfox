import { renderHook, act } from "@testing-library/react";
import {
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import { useProfiles } from "../use-profiles";
import { MemoryStorage } from "../../utils/tests/memory-storage";
import { type Profile } from "@monyfox/common-data";

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

describe("useProfiles", () => {
  beforeEach(() => {
    memoryStorage.clear();
  });

  test("initialize with profiles from localStorage", () => {
    const profile = {
      id: "1",
      user: "Test User",
      data: {
        encrypted: false,
        data: {
          accounts: [],
          assetSymbols: [],
          transactions: [],
          lastUpdated: new Date().toISOString(),
        },
      },
      schemaVersion: "1",
    };
    memoryStorage.setItem(`profile:${profile.id}`, JSON.stringify(profile));

    const { result } = renderHook(() => useProfiles());
    expect(result.current.profiles).toEqual([profile]);
  });

  test("skip other localStorage items", () => {
    memoryStorage.setItem("other", "other");
    const { result } = renderHook(() => useProfiles());
    expect(result.current.profiles).toEqual([]);
  });

  test("skip invalid profiles", () => {
    memoryStorage.setItem("profile:invalid", "invalid");
    const { result } = renderHook(() => useProfiles());
    expect(result.current.profiles).toEqual([]);
  });

  test("skip profiles with invalid schema", () => {
    memoryStorage.setItem(
      `profile:profile-id`,
      JSON.stringify({ schemaVersion: "invalid" }),
    );
    const { result } = renderHook(() => useProfiles());
    expect(result.current.profiles).toEqual([]);
  });

  test("prevent race condition by skipping null profiles", () => {
    // This is a workaround for a race condition in the test environment
    memoryStorage.setItem(`profile:profile-id`, null as unknown as string);
    const { result } = renderHook(() => useProfiles());
    expect(result.current.profiles).toEqual([]);
  });

  test("create a new profile", () => {
    const { result } = renderHook(() => useProfiles());
    const newProfile: Profile = {
      id: "2",
      user: "New User",
      data: {
        encrypted: false,
        data: {
          accounts: [],
          assetSymbols: [],
          transactions: [],
          lastUpdated: new Date().toISOString(),
        },
      },
      schemaVersion: "1",
    };

    act(() => {
      result.current.createProfile(newProfile);
    });

    expect(result.current.profiles).toContainEqual(newProfile);
    expect(memoryStorage.getItem(`profile:${newProfile.id}`)).toEqual(
      JSON.stringify(newProfile),
    );
  });

  test("delete a profile", () => {
    const profile: Profile = {
      id: "3",
      user: "Test User",
      data: {
        encrypted: false,
        data: {
          accounts: [],
          assetSymbols: [],
          transactions: [],
          lastUpdated: new Date().toISOString(),
        },
      },
      schemaVersion: "1",
    };
    memoryStorage.setItem(`profile:${profile.id}`, JSON.stringify(profile));

    const { result } = renderHook(() => useProfiles());

    act(() => {
      result.current.deleteProfile(profile.id);
    });

    expect(result.current.profiles).not.toContainEqual(profile);
    expect(memoryStorage.getItem(`profile:${profile.id}`)).toBeNull();
  });
});
