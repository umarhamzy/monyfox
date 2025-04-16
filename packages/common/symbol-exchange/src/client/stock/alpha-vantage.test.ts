import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { AlphaVantageSymbolExchangeClient } from "./alpha-vantage";

export const restHandlers = [
  http.get("https://www.alphavantage.co/query", ({ request }) => {
    const url = new URL(request.url);
    const functionParam = url.searchParams.get("function");

    if (functionParam === "TIME_SERIES_DAILY") {
      const symbol = url.searchParams.get("symbol");
      const apikey = url.searchParams.get("apikey");

      if (symbol !== "IBM" || apikey !== "test-api-key") {
        return HttpResponse.json({
          "Error Message": "Error message for invalid request",
        });
      }

      return HttpResponse.json({
        "Meta Data": {
          "1. Information": "Daily Prices (open, high, low, close) and Volumes",
          "2. Symbol": "IBM",
          "3. Last Refreshed": "2025-04-20",
          "4. Output Size": "Full size",
          "5. Time Zone": "US/Eastern",
        },
        "Time Series (Daily)": {
          "2025-04-20": {
            "1. open": "242.0000",
            "2. high": "243.5000",
            "3. low": "241.0000",
            "4. close": "243.0000",
            "5. volume": "3500000",
          },
          "2025-04-18": {
            "1. open": "241.0000",
            "2. high": "242.5000",
            "3. low": "240.0000",
            "4. close": "241.5000",
            "5. volume": "3400000",
          },
          "2025-04-17": {
            "1. open": "240.5000",
            "2. high": "241.8000",
            "3. low": "239.5000",
            "4. close": "240.8000",
            "5. volume": "3300000",
          },
          "2025-04-15": {
            "1. open": "239.5500",
            "2. high": "241.5300",
            "3. low": "238.2700",
            "4. close": "240.7000",
            "5. volume": "3363708",
          },
          "2025-04-14": {
            "1. open": "239.7700",
            "2. high": "241.7700",
            "3. low": "236.7300",
            "4. close": "239.0600",
            "5. volume": "3321717",
          },
          "2025-04-13": {
            "1. open": "238.0000",
            "2. high": "239.5000",
            "3. low": "237.0000",
            "4. close": "238.5000",
            "5. volume": "3200000",
          },
        },
      });
    }

    if (functionParam === "SYMBOL_SEARCH") {
      const keywords = url.searchParams.get("keywords");
      const apikey = url.searchParams.get("apikey");

      if (keywords !== "tesco" || apikey !== "test-api-key") {
        return HttpResponse.json({
          "Error Message": "Error message for invalid request",
        });
      }

      return HttpResponse.json({
        bestMatches: [
          {
            "1. symbol": "TSCO.LON",
            "2. name": "Tesco PLC",
            "3. type": "Equity",
            "4. region": "United Kingdom",
            "5. marketOpen": "08:00",
            "6. marketClose": "16:30",
            "7. timezone": "UTC+01",
            "8. currency": "GBX",
            "9. matchScore": "0.7273",
          },
          {
            "1. symbol": "TSCDF",
            "2. name": "Tesco plc",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-04",
            "8. currency": "USD",
            "9. matchScore": "0.7143",
          },
        ],
      });
    }
  }),
];

const server = setupServer(...restHandlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getExchangeRates", () => {
  test("should return exchange rates for IBM with missing dates", async () => {
    const client = new AlphaVantageSymbolExchangeClient({
      apiKey: "test-api-key",
    });
    const rates = await client.getExchangeRates({
      from: "IBM",
      to: "USD",
      startDate: "2025-04-13",
      endDate: "2025-04-20",
    });
    expect(rates).toEqual([
      { date: "2025-04-13", rate: 238.5 },
      { date: "2025-04-14", rate: 239.06 },
      { date: "2025-04-15", rate: 240.7 },
      { date: "2025-04-17", rate: 240.8 },
      { date: "2025-04-18", rate: 241.5 },
      { date: "2025-04-20", rate: 243.0 },
    ]);
  });

  test("should return exchange rates for a single day", async () => {
    const client = new AlphaVantageSymbolExchangeClient({
      apiKey: "test-api-key",
    });
    const rates = await client.getExchangeRates({
      from: "IBM",
      to: "USD",
      startDate: "2025-04-15",
      endDate: "2025-04-15",
    });
    expect(rates).toEqual([{ date: "2025-04-15", rate: 240.7 }]);
  });

  test("should return an empty array for a date range with no data", async () => {
    const client = new AlphaVantageSymbolExchangeClient({
      apiKey: "test-api-key",
    });
    const rates = await client.getExchangeRates({
      from: "IBM",
      to: "USD",
      startDate: "2025-04-10",
      endDate: "2025-04-12",
    });
    expect(rates).toEqual([]);
  });

  test("should throw an error for invalid API key", async () => {
    const client = new AlphaVantageSymbolExchangeClient({
      apiKey: "invalid-key",
    });

    await expect(
      client.getExchangeRates({
        from: "IBM",
        to: "USD",
        startDate: "2025-04-14",
        endDate: "2025-04-15",
      }),
    ).rejects.toThrow("Error message for invalid request");
  });
});

describe("searchSymbol", () => {
  test("should return symbol search results for a valid keyword", async () => {
    const client = new AlphaVantageSymbolExchangeClient({
      apiKey: "test-api-key",
    });

    const results = await client.searchSymbol({ symbol: "tesco" });

    expect(results).toEqual([
      {
        code: "TSCO.LON",
        displayName: "Tesco PLC",
        type: "Equity",
        region: "United Kingdom",
        marketOpen: "08:00",
        marketClose: "16:30",
        timezone: "UTC+01",
        currency: "GBX",
      },
      {
        code: "TSCDF",
        displayName: "Tesco plc",
        type: "Equity",
        region: "United States",
        marketOpen: "09:30",
        marketClose: "16:00",
        timezone: "UTC-04",
        currency: "USD",
      },
    ]);
  });

  test("should throw an error for invalid API key", async () => {
    const client = new AlphaVantageSymbolExchangeClient({
      apiKey: "invalid-key",
    });

    await expect(client.searchSymbol({ symbol: "tesco" })).rejects.toThrow(
      "Error message for invalid request",
    );
  });
});
