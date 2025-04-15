import { renderHook } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useAssetSymbolExchangeRate } from "./use-asset-symbol-exchange-rate";

describe("useAssetSymbolExchangeRate", () => {
  test("should throw an error if used outside of AssetSymbolExchangeRateProvider", () => {
    expect(() => renderHook(() => useAssetSymbolExchangeRate())).toThrowError(
      "useAssetSymbolExchangeRate must be used within a AssetSymbolExchangeRateProvider",
    );
  });
});
