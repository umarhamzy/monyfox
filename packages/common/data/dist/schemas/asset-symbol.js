import { z } from "zod";
export const AssetSymbolSchema = z.object({
    id: z.string(),
    code: z.string(),
    displayName: z.string(),
    type: z.union([
        z.literal("fiat"),
        z.literal("stock"),
        z.literal("crypto"),
        z.literal("commodity"),
        z.literal("other"),
    ]),
});
const ExchangerSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("frankfurter"),
        base: z.string(),
        target: z.string(),
    }),
]);
export const AssetSymbolExchangeSchema = z.object({
    id: z.string(),
    fromAssetSymbolId: z.string(),
    toAssetSymbolId: z.string(),
    exchanger: ExchangerSchema,
});
//# sourceMappingURL=asset-symbol.js.map