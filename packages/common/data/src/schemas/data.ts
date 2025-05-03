import { z } from "zod";
import { AccountSchema } from "./account";
import { TransactionSchema } from "./transaction";
import {
  AssetSymbolExchangersMetadataSchema,
  AssetSymbolExchangeSchema,
  AssetSymbolSchema,
} from "./asset-symbol";
import { TransactionCategorySchema } from "./transaction-category";

export const DataSchema = z.object({
  accounts: z.array(AccountSchema),
  transactions: z.array(TransactionSchema),
  transactionCategories: z.array(TransactionCategorySchema),
  assetSymbols: z.array(AssetSymbolSchema),
  assetSymbolExchanges: z.array(AssetSymbolExchangeSchema),
  assetSymbolExchangersMetadata: AssetSymbolExchangersMetadataSchema,

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
