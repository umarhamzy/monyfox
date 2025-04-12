import { z } from "zod";

export const CurrencySchema = z.record(z.string(), z.string());
type Currency = z.infer<typeof CurrencySchema>;

export interface CurrencyClient {
  getCurrencies(): Promise<Currency[]>;
}
