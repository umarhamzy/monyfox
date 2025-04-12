import { describe, expect, test } from "vitest";

import { AssetSymbolSchema } from "./asset-symbol";

describe("AssetSymbolSchema", () => {
  test("invalid", () => {
    const symbol = {
      id: "1",
      code: "EUR",
      displayName: "Euro",
      type: "fiat",
    };
    const { success } = AssetSymbolSchema.safeParse(symbol);
    expect(success).toBe(true);
  });

  test("invalid", () => {
    const symbol = {
      id: "1",
    };
    const { success } = AssetSymbolSchema.safeParse(symbol);
    expect(success).toBe(false);
  });
});
