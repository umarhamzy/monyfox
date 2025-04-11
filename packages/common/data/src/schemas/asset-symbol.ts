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
