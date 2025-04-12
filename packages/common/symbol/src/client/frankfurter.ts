import { CurrencySchema } from ".";

export class FrankfurterCurrencyClient {
  private static readonly baseUrl = "https://api.frankfurter.dev";

  static async getCurrencies() {
    const response = await fetch(`${this.baseUrl}/v1/currencies`);
    const rawData = await response.json();
    const data = CurrencySchema.parse(rawData);
    return Object.entries(data)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }
}
