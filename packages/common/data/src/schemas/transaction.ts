import { z } from "zod";

const AccountDataSchema = z.object({
  amount: z.number().nonnegative(),
  symbolId: z.string(),
  account: z.union([
    z.object({
      id: z.string(),
    }),
    z.object({
      name: z.string(),
    }),
  ]),
});

export const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  transactionCategoryId: z.string().nullable(),
  transactionDate: z.iso.date(),
  accountingDate: z.iso.date(),
  from: AccountDataSchema,
  to: AccountDataSchema,
});
