import { z } from "zod";
import { AssetSymbolSchema } from "./asset-symbol";

export const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  from: z.object({
    amount: z.number(),
    symbol: AssetSymbolSchema,
    accountId: z.string().nullable(),
    accountName: z.string().nullable(),
  }),
  to: z.object({
    amount: z.number(),
    symbol: AssetSymbolSchema,
    accountId: z.string().nullable(),
    accountName: z.string().nullable(),
  }),
});
