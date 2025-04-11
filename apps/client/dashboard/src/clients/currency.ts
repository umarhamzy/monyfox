import { z } from "zod";

const CurrencySchema = z.record(z.string(), z.string());

export class CurrencyClient {
  private static readonly baseUrl = "https://api.frankfurter.dev";

  static async getCurrencies() {
    const response = await fetch(`${this.baseUrl}/v1/currencies`);
    const data = await response.json();
    const parsedData = CurrencySchema.parse(data);
    return Object.entries(parsedData)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }
}
