import { describe, expect, test } from "vitest";
import { AssetSymbolExchangeSchema, AssetSymbolSchema } from "./asset-symbol";
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
describe("AssetSymbolExchangeSchema", () => {
    test("valid", () => {
        const exchange = {
            id: "1",
            fromAssetSymbolId: "1",
            toAssetSymbolId: "2",
            exchanger: {
                type: "frankfurter",
                base: "USD",
                target: "EUR",
            },
        };
        const { success } = AssetSymbolExchangeSchema.safeParse(exchange);
        expect(success).toBe(true);
    });
    test("invalid", () => {
        const exchange = {
            id: "1",
            fromAssetSymbolId: "1",
            toAssetSymbolId: "2",
        };
        const { success } = AssetSymbolExchangeSchema.safeParse(exchange);
        expect(success).toBe(false);
    });
});
//# sourceMappingURL=asset-symbol.test.js.map