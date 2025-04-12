import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { FrankfurterCurrencyClient } from "./frankfurter";

export const restHandlers = [
  http.get("https://api.frankfurter.dev/v1/currencies", () => {
    return HttpResponse.json({
      EUR: "Euro",
      USD: "United States Dollar",
    });
  }),
];

const server = setupServer(...restHandlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should return exchange rates", async () => {
  const currencies = await FrankfurterCurrencyClient.getCurrencies();
  expect(currencies).toEqual([
    { code: "EUR", name: "Euro" },
    { code: "USD", name: "United States Dollar" },
  ]);
});
