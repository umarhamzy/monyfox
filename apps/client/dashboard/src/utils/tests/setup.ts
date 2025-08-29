import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

import "@testing-library/jest-dom";
import "fake-indexeddb/auto";
import { beforeEach } from "node:test";
import { toast } from "sonner";

// https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
window.HTMLElement.prototype.scrollIntoView = function () {};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const restHandlers = [
  http.get("https://www.alphavantage.co/query", ({ request }) => {
    const url = new URL(request.url);
    const functionParam = url.searchParams.get("function");

    if (functionParam === "TIME_SERIES_DAILY") {
      const symbol = url.searchParams.get("symbol");
      const apikey = url.searchParams.get("apikey");

      if (apikey !== "TEST_API_KEY") {
        return HttpResponse.json({
          Information: `We have detected your API key as ${apikey} and our standard API rate limit is 25 requests per day. Please subscribe to any of the premium plans at https://www.alphavantage.co/premium/ to instantly remove all daily rate limits.`,
        });
      }

      return HttpResponse.json({
        "Meta Data": {
          "1. Information": "Daily Prices (open, high, low, close) and Volumes",
          "2. Symbol": symbol,
          "3. Last Refreshed": "2025-04-20",
          "4. Output Size": "Full size",
          "5. Time Zone": "US/Eastern",
        },
        "Time Series (Daily)": {
          "2025-01-01": {
            "1. open": "100.0000",
            "2. high": "120.5000",
            "3. low": "80.0000",
            "4. close": "110.0000",
            "5. volume": "3500000",
          },
          "2025-04-01": {
            "1. open": "110.0000",
            "2. high": "130.0000",
            "3. low": "90.0000",
            "4. close": "120.0000",
            "5. volume": "4000000",
          },
        },
      });
    }

    if (functionParam === "SYMBOL_SEARCH") {
      const keywords = url.searchParams.get("keywords");
      const apikey = url.searchParams.get("apikey");

      if (apikey !== "TEST_API_KEY") {
        return HttpResponse.json({
          "Error Message": "The api key is invalid.",
        });
      }

      if (keywords === "NON_EXISTING") {
        return HttpResponse.json({
          bestMatches: [],
        });
      }

      return HttpResponse.json({
        bestMatches: [
          {
            "1. symbol": keywords,
            "2. name": `${keywords} name`,
            "3. type": "Equity",
            "4. region": "Europe",
            "5. marketOpen": "08:00",
            "6. marketClose": "16:30",
            "7. timezone": "UTC+01",
            "8. currency": "EUR",
            "9. matchScore": "1.0000",
          },
          {
            "1. symbol": keywords + ".ETF",
            "2. name": `${keywords} ETF name`,
            "3. type": "ETF",
            "4. region": "Europe",
            "5. marketOpen": "08:00",
            "6. marketClose": "16:30",
            "7. timezone": "UTC+01",
            "8. currency": "EUR",
            "9. matchScore": "0.8000",
          },
        ],
      });
    }
  }),
  http.get("https://api.frankfurter.dev/v1/currencies", () =>
    HttpResponse.json({
      AUD: "Australian Dollar",
      BGN: "Bulgarian Lev",
      BRL: "Brazilian Real",
      CAD: "Canadian Dollar",
      CHF: "Swiss Franc",
      CNY: "Chinese Renminbi Yuan",
      CZK: "Czech Koruna",
      DKK: "Danish Krone",
      EUR: "Euro",
      GBP: "British Pound",
      HKD: "Hong Kong Dollar",
      HUF: "Hungarian Forint",
      IDR: "Indonesian Rupiah",
      ILS: "Israeli New Sheqel",
      INR: "Indian Rupee",
      ISK: "Icelandic Króna",
      JPY: "Japanese Yen",
      KRW: "South Korean Won",
      MXN: "Mexican Peso",
      MYR: "Malaysian Ringgit",
      NOK: "Norwegian Krone",
      NZD: "New Zealand Dollar",
      PHP: "Philippine Peso",
      PLN: "Polish Złoty",
      RON: "Romanian Leu",
      SEK: "Swedish Krona",
      SGD: "Singapore Dollar",
      THB: "Thai Baht",
      TRY: "Turkish Lira",
      USD: "United States Dollar",
      ZAR: "South African Rand",
    }),
  ),
];

const server = setupServer(...restHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  toast.getHistory().forEach((t) => toast.dismiss(t.id));
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
