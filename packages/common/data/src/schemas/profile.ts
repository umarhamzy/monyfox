import { z } from "zod";
import { RawDataSchema } from "./data";

export const ProfileSchema = z.object({
  id: z.string(),
  user: z.string(),
  data: RawDataSchema,
  schemaVersion: z.literal("1"),
});
