import { z } from "zod";

export const AssetSymbolSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("currency"),
    currency: z.string(),
  }),
  z.object({
    type: z.literal("stock"),
    ticker: z.string(),
  }),
]);
