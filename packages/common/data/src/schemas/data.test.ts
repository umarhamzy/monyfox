import { describe, expect, test } from "vitest";

import { RawDataSchema } from "./data";

describe("RawDataSchema", () => {
  test("invalid", () => {
    const data = {
      encrypted: true,
      data: "encrypted data",
    };
    const { success } = RawDataSchema.safeParse(data);
    expect(success).toBe(true);
  });

  test("invalid", () => {
    const data = {
      encrypted: false,
      data: "encrypted data",
    };
    const { success } = RawDataSchema.safeParse(data);
    expect(success).toBe(false);
  });
});
