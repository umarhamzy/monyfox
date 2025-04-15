import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { FrankfurterSymbolExchangeClient } from "./frankfurter";
export const restHandlers = [
    http.get("https://api.frankfurter.dev/v1/2025-01-01..2025-01-14", ({ request }) => {
        const url = new URL(request.url);
        const base = url.searchParams.get("base");
        const symbols = url.searchParams.get("symbols");
        if (!base || base !== "EUR" || !symbols || symbols !== "USD") {
            throw new Error("Unexpected request for test");
        }
        return HttpResponse.json({
            amount: 1,
            base: "EUR",
            start_date: "2024-12-31",
            end_date: "2025-01-14",
            rates: {
                "2024-12-31": {
                    USD: 1.0389,
                },
                "2025-01-02": {
                    USD: 1.0321,
                },
                "2025-01-03": {
                    USD: 1.0299,
                },
                "2025-01-06": {
                    USD: 1.0426,
                },
                "2025-01-07": {
                    USD: 1.0393,
                },
                "2025-01-08": {
                    USD: 1.0286,
                },
                "2025-01-09": {
                    USD: 1.0305,
                },
                "2025-01-10": {
                    USD: 1.0304,
                },
                "2025-01-13": {
                    USD: 1.0198,
                },
                "2025-01-14": {
                    USD: 1.0245,
                },
            },
        });
    }),
];
const server = setupServer(...restHandlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
test("should return exchange rates", async () => {
    const client = new FrankfurterSymbolExchangeClient();
    const rates = await client.getExchangeRates({
        from: "EUR",
        to: "USD",
        startDate: "2024-12-31",
        endDate: "2025-01-14",
    });
    expect(rates).toEqual([
        { date: "2024-12-31", rate: 1.0389, isFinal: true },
        { date: "2025-01-02", rate: 1.0321, isFinal: true },
        { date: "2025-01-03", rate: 1.0299, isFinal: true },
        { date: "2025-01-06", rate: 1.0426, isFinal: true },
        { date: "2025-01-07", rate: 1.0393, isFinal: true },
        { date: "2025-01-08", rate: 1.0286, isFinal: true },
        { date: "2025-01-09", rate: 1.0305, isFinal: true },
        { date: "2025-01-10", rate: 1.0304, isFinal: true },
        { date: "2025-01-13", rate: 1.0198, isFinal: true },
        { date: "2025-01-14", rate: 1.0245, isFinal: true },
    ]);
});
//# sourceMappingURL=frankfurter.test.js.map