import { describe, expect, test } from "vitest";
import { generateTestProfile } from "./data";

describe("generateTestProfile", () => {
  test("generate a profile with the correct structure", () => {
    const profile = generateTestProfile();

    if (profile.data.encrypted === true) {
      throw new Error("Profile should not be encrypted");
    }

    expect(profile.data.data.accounts.length).toBeGreaterThan(0);
    expect(profile.data.data.transactions.length).toBeGreaterThan(0);
    expect(profile.data.data.assetSymbols.length).toBeGreaterThan(0);
  });
});