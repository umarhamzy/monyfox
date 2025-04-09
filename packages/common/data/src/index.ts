import { z } from "zod";

const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const AssetSymbolSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("currency"),
    currency: z.string(),
  }),
  z.object({
    type: z.literal("stock"),
    ticker: z.string(),
  }),
]);

const TransactionSchema = z.object({
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

const DataSchema = z.object({});

const RawDataSchema = z.discriminatedUnion("encrypted", [
  z.object({
    encrypted: z.literal(true),
    data: z.string(),
  }),
  z.object({
    encrypted: z.literal(false),
    data: DataSchema,
  }),
]);

const ProfileSchema = z.object({
  id: z.string(),
  user: z.string(),
  data: RawDataSchema,
  schemaVersion: z.literal("1"),
});
