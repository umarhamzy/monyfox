import { z } from "zod";
import { AccountSchema } from "./account";
import { TransactionSchema } from "./transaction";
import { AssetSymbolExchangeSchema, AssetSymbolSchema } from "./asset-symbol";
export const DataSchema = z.object({
    accounts: z.array(AccountSchema),
    transactions: z.array(TransactionSchema),
    assetSymbols: z.array(AssetSymbolSchema),
    assetSymbolExchanges: z.array(AssetSymbolExchangeSchema),
    lastUpdated: z.string().datetime(),
});
export const RawDataSchema = z.discriminatedUnion("encrypted", [
    z.object({
        encrypted: z.literal(true),
        data: z.string(),
    }),
    z.object({
        encrypted: z.literal(false),
        data: DataSchema,
    }),
]);
//# sourceMappingURL=data.js.map