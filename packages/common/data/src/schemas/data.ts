import { z } from "zod";

export const DataSchema = z.object({});

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
