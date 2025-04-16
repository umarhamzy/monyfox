import { z } from "zod";
import {
  GetExchangeRateRequest,
  GetExchangeRateResponse,
  SymbolExchangeClient,
} from "..";

// Example response:
// {
//   "amount": 1,
//   "base": "EUR",
//   "start_date": "2024-12-31",
//   "end_date": "2025-04-11",
//   "rates": {
//     "2024-12-31": {
//       "USD": 1.0389
//     },
//     "2025-01-02": {
//       "USD": 1.0321
//     },
//     "2025-01-03": {
//       "USD": 1.0299
//     }
//   }
// }

const RatesSchema = z.object({
  amount: z.number(),
  base: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  rates: z.record(z.string(), z.record(z.string(), z.number())),
});

export class FrankfurterSymbolExchangeClient implements SymbolExchangeClient {
  private readonly baseUrl = "https://api.frankfurter.dev";

  async getExchangeRates(
    params: GetExchangeRateRequest,
  ): Promise<GetExchangeRateResponse> {
    const { from, to, startDate, endDate } = params;
    const url = `${this.baseUrl}/v1/${startDate}..${endDate}?base=${from}&symbols=${to}`;
    const response = await fetch(url);
    const rawData = await response.json();
    const data = RatesSchema.parse(rawData);
    return Object.entries(data.rates).map(([date, rates]) => ({
      date,
      rate: rates[to],
    }));
  }
}
