import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string().date(),
  from: z.object({
    amount: z.number(),
    symbolId: z.string(),
    accountId: z.string().nullable(),
    accountName: z.string().nullable(),
  }),
  to: z.object({
    amount: z.number(),
    symbolId: z.string(),
    accountId: z.string().nullable(),
    accountName: z.string().nullable(),
  }),
});
