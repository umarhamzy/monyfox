import { z } from "zod";
import {
  GetExchangeRateRequest,
  GetExchangeRateResponse,
  SymbolExchangeClient,
} from "..";

// Example response
// GET /query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=demo
// {
//   "Meta Data": {
//     "1. Information": "Daily Prices (open, high, low, close) and Volumes",
//     "2. Symbol": "IBM",
//     "3. Last Refreshed": "2025-04-15",
//     "4. Output Size": "Full size",
//     "5. Time Zone": "US/Eastern"
//   },
//   "Time Series (Daily)": {
//     "2025-04-15": {
//         "1. open": "239.5500",
//         "2. high": "241.5300",
//         "3. low": "238.2700",
//         "4. close": "240.7000",
//         "5. volume": "3363708"
//     },
//     "2025-04-14": {
//         "1. open": "239.7700",
//         "2. high": "241.7700",
//         "3. low": "236.7300",
//         "4. close": "239.0600",
//         "5. volume": "3321717"
//     }
//   }
// }

// Example response
// GET /query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo
// {
//   "bestMatches": [
//     {
//       "1. symbol": "TSCO.LON",
//       "2. name": "Tesco PLC",
//       "3. type": "Equity",
//       "4. region": "United Kingdom",
//       "5. marketOpen": "08:00",
//       "6. marketClose": "16:30",
//       "7. timezone": "UTC+01",
//       "8. currency": "GBX",
//       "9. matchScore": "0.7273"
//     },
//     {
//       "1. symbol": "TSCDF",
//       "2. name": "Tesco plc",
//       "3. type": "Equity",
//       "4. region": "United States",
//       "5. marketOpen": "09:30",
//       "6. marketClose": "16:00",
//       "7. timezone": "UTC-04",
//       "8. currency": "USD",
//       "9. matchScore": "0.7143"
//     }
//   ]
// }

const RatesSchema = z.object({
  "Meta Data": z.object({
    "1. Information": z.string(),
    "2. Symbol": z.string(),
    "3. Last Refreshed": z.string(),
    "4. Output Size": z.string(),
    "5. Time Zone": z.string(),
  }),
  "Time Series (Daily)": z.record(
    z.object({
      "1. open": z.string(),
      "2. high": z.string(),
      "3. low": z.string(),
      "4. close": z.string(),
      "5. volume": z.string(),
    }),
  ),
});

const SymbolSearchSchema = z.object({
  bestMatches: z.array(
    z.object({
      "1. symbol": z.string(),
      "2. name": z.string(),
      "3. type": z.string(),
      "4. region": z.string(),
      "5. marketOpen": z.string(),
      "6. marketClose": z.string(),
      "7. timezone": z.string(),
      "8. currency": z.string(),
      "9. matchScore": z.string(),
    }),
  ),
});

type SymbolSearchResponse = Array<{
  code: string;
  displayName: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
}>;

const ErrorSchema = z.object({
  "Error Message": z.string(),
});

export class AlphaVantageSymbolExchangeClient implements SymbolExchangeClient {
  private readonly baseUrl = "https://www.alphavantage.co";
  private apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  async getExchangeRates(
    params: GetExchangeRateRequest,
  ): Promise<GetExchangeRateResponse> {
    const { from, to, startDate, endDate } = params;
    const url = `${this.baseUrl}/query?function=TIME_SERIES_DAILY&symbol=${from}&outputsize=full&apikey=${this.apiKey}`;
    const response = await fetch(url);
    const rawData = await response.json();
    const error = ErrorSchema.safeParse(rawData);
    if (error.success) {
      throw new Error(error.data["Error Message"]);
    }

    const data = RatesSchema.parse(rawData);
    const rates = data["Time Series (Daily)"];
    return Object.entries(rates)
      .filter(([date]) => date >= startDate && date <= endDate)
      .map(([date, rates]) => ({
        date,
        rate: parseFloat(rates["4. close"]),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async searchSymbol(params: {
    symbol: string;
  }): Promise<SymbolSearchResponse> {
    const { symbol } = params;
    const url = `${this.baseUrl}/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${this.apiKey}`;
    const response = await fetch(url);
    const rawData = await response.json();
    const error = ErrorSchema.safeParse(rawData);
    if (error.success) {
      throw new Error(error.data["Error Message"]);
    }

    const data = SymbolSearchSchema.parse(rawData);
    return data.bestMatches.map((match) => ({
      code: match["1. symbol"],
      displayName: match["2. name"],
      type: match["3. type"],
      region: match["4. region"],
      marketOpen: match["5. marketOpen"],
      marketClose: match["6. marketClose"],
      timezone: match["7. timezone"],
      currency: match["8. currency"],
    }));
  }
}
