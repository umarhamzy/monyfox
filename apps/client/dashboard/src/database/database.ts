import { type Profile } from "@monyfox/common-data";
import { z } from "zod";

export const ExchangeRateDbSchema = z.object({
  id: z.string(),
  updatedAt: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  data: z.array(
    z.object({
      date: z.string(),
      rate: z.number(),
    }),
  ),
});
export type ExchangeRateDb = z.infer<typeof ExchangeRateDbSchema>;

export interface Database {
  init(): Promise<void>;
  profiles: DatabaseStore<Profile>;
  exchangeRates: DatabaseStore<ExchangeRateDb>;
}

export interface DatabaseStore<T> {
  getAll(): Promise<T[]>;
  upsert(item: T): Promise<void>;
  delete(id: string): Promise<void>;
}
