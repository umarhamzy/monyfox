import { z } from "zod";

export const AssetSymbolSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("currency"),
    currency: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("stock"),
    ticker: z.string(),
  }),
]);
