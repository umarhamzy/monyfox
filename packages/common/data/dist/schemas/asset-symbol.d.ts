import { z } from "zod";
export declare const AssetSymbolSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    displayName: z.ZodString;
    type: z.ZodUnion<[z.ZodLiteral<"fiat">, z.ZodLiteral<"stock">, z.ZodLiteral<"crypto">, z.ZodLiteral<"commodity">, z.ZodLiteral<"other">]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    code: string;
    type: "fiat" | "stock" | "crypto" | "commodity" | "other";
    displayName: string;
}, {
    id: string;
    code: string;
    type: "fiat" | "stock" | "crypto" | "commodity" | "other";
    displayName: string;
}>;
export declare const AssetSymbolExchangeSchema: z.ZodObject<{
    id: z.ZodString;
    fromAssetSymbolId: z.ZodString;
    toAssetSymbolId: z.ZodString;
    exchanger: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"frankfurter">;
        base: z.ZodString;
        target: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "frankfurter";
        base: string;
        target: string;
    }, {
        type: "frankfurter";
        base: string;
        target: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    fromAssetSymbolId: string;
    toAssetSymbolId: string;
    exchanger: {
        type: "frankfurter";
        base: string;
        target: string;
    };
}, {
    id: string;
    fromAssetSymbolId: string;
    toAssetSymbolId: string;
    exchanger: {
        type: "frankfurter";
        base: string;
        target: string;
    };
}>;
//# sourceMappingURL=asset-symbol.d.ts.map