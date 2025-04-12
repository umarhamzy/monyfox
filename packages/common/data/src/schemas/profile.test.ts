import { describe, expect, test } from "vitest";

import { ProfileSchema } from "./profile";

describe("ProfileSchema", () => {
  test("invalid", () => {
    const profile = {
      id: "1",
      user: "user",
      data: { encrypted: true, data: "" },
      schemaVersion: "1",
    };
    const { success } = ProfileSchema.safeParse(profile);
    expect(success).toBe(true);
  });

  test("invalid", () => {
    const profile = {
      id: "1",
    };
    const { success } = ProfileSchema.safeParse(profile);
    expect(success).toBe(false);
  });
});
