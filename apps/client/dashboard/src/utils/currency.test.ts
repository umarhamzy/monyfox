import { describe, expect, test } from "vitest";
import { formatCurrency } from "./currency";

const testLocale = "it-IT";

describe("formatCurrency", () => {
  test("format fiat currencies", () => {
    expect(
      formatCurrency(
        1234.56,
        {
          id: "1",
          type: "fiat",
          code: "EUR",
          displayName: "Euro",
        },
        testLocale,
      ),
    ).toBe("1234,56 €");
  });

  test("format invalid fiat currencies", () => {
    expect(
      formatCurrency(
        1234.56,
        {
          id: "1",
          type: "fiat",
          code: "UNKNOWN",
          displayName: "Unknown",
        },
        testLocale,
      ),
    ).toBe("1234,56 UNKNOWN");
  });

  test("format crypto currencies", () => {
    expect(
      formatCurrency(
        1234.56,
        {
          id: "1",
          type: "crypto",
          code: "BTC",
          displayName: "Bitcoin",
        },
        testLocale,
      ),
    ).toBe("1234,56 BTC");
  });

  test("format with default locale", () => {
    expect(
      formatCurrency(1234.56, {
        id: "1",
        type: "fiat",
        code: "EUR",
        displayName: "Euro",
      }),
    ).not.toBe("");
  });
});
