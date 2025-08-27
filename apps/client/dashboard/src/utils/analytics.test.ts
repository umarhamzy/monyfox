import { describe, test, expect, vi, beforeEach } from "vitest";
import { init } from "@plausible-analytics/tracker/plausible.js";
import { initializeAnalytics } from "./analytics";

vi.mock("@plausible-analytics/tracker/plausible.js", () => {
  return {
    init: vi.fn(),
  };
});

describe("initializeAnalytics", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test("should initialize plausible analytics with the correct domain", () => {
    const mockDomain = "https://example.com";
    vi.stubEnv("VITE_PLAUSIBLE_DOMAIN", mockDomain);

    initializeAnalytics();

    expect(init).toHaveBeenCalledWith({
      domain: mockDomain,
    });
  });

  test("should not initialize plausible analytics if the domain is invalid", () => {
    vi.stubEnv("VITE_PLAUSIBLE_DOMAIN", "invalid-url");

    initializeAnalytics();

    expect(init).not.toHaveBeenCalled();
  });

  test("should not initialize plausible analytics if the env variable is undefined", () => {
    vi.stubEnv("VITE_PLAUSIBLE_DOMAIN", undefined);

    initializeAnalytics();

    expect(init).not.toHaveBeenCalled();
  });
});
