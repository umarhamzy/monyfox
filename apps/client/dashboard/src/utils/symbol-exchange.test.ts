import { describe, expect, test } from "vitest";
import { convertAmount, getConversionMap } from "./symbol-exchange";

describe("getConversionMap", () => {
  test("should return correct conversion map for a single symbol pair", () => {
    const startDate = "2025-01-01";
    const endDate = "2025-01-05";
    const results = [
      {
        id: "1",
        fromAssetSymbolId: "USD",
        toAssetSymbolId: "EUR",
        rates: [
          { date: "2025-01-01", rate: 0.85, isFinal: true },
          { date: "2025-01-03", rate: 0.86, isFinal: true },
          { date: "2025-01-05", rate: 0.87, isFinal: true },
        ],
      },
    ];

    const expectedMap = {
      USD: {
        EUR: {
          "2025-01-01": 0.85,
          "2025-01-02": 0.85,
          "2025-01-03": 0.86,
          "2025-01-04": 0.86,
          "2025-01-05": 0.87,
        },
      },
    };

    const conversionMap = getConversionMap({ startDate, endDate, results });
    expect(conversionMap).toEqual(expectedMap);
  });

  test("should handle multiple symbol pairs", () => {
    const startDate = "2025-01-01";
    const endDate = "2025-01-05";
    const results = [
      {
        id: "1",
        fromAssetSymbolId: "USD",
        toAssetSymbolId: "EUR",
        rates: [
          { date: "2025-01-01", rate: 0.85, isFinal: true },
          { date: "2025-01-03", rate: 0.86, isFinal: true },
          { date: "2025-01-05", rate: 0.87, isFinal: true },
        ],
      },
      {
        id: "2",
        fromAssetSymbolId: "USD",
        toAssetSymbolId: "JPY",
        rates: [
          { date: "2025-01-01", rate: 110, isFinal: true },
          { date: "2025-01-04", rate: 112, isFinal: true },
        ],
      },
    ];

    const expectedMap = {
      USD: {
        EUR: {
          "2025-01-01": 0.85,
          "2025-01-02": 0.85,
          "2025-01-03": 0.86,
          "2025-01-04": 0.86,
          "2025-01-05": 0.87,
        },
        JPY: {
          "2025-01-01": 110,
          "2025-01-02": 110,
          "2025-01-03": 110,
          "2025-01-04": 112,
          "2025-01-05": 112,
        },
      },
    };

    const conversionMap = getConversionMap({ startDate, endDate, results });
    expect(conversionMap).toEqual(expectedMap);
  });

  test("should handle missing dates by using the last known rate", () => {
    const startDate = "2025-01-01";
    const endDate = "2025-01-05";
    const results = [
      {
        id: "1",
        fromAssetSymbolId: "USD",
        toAssetSymbolId: "EUR",
        rates: [
          { date: "2025-01-01", rate: 0.85, isFinal: true },
          { date: "2025-01-05", rate: 0.87, isFinal: true },
        ],
      },
    ];

    const expectedMap = {
      USD: {
        EUR: {
          "2025-01-01": 0.85,
          "2025-01-02": 0.85,
          "2025-01-03": 0.85,
          "2025-01-04": 0.85,
          "2025-01-05": 0.87,
        },
      },
    };

    const conversionMap = getConversionMap({ startDate, endDate, results });
    expect(conversionMap).toEqual(expectedMap);
  });

  test("should handle no rates by using a default rate of 1", () => {
    const startDate = "2025-01-01";
    const endDate = "2025-01-05";
    const results = [
      {
        id: "1",
        fromAssetSymbolId: "USD",
        toAssetSymbolId: "EUR",
        rates: [],
      },
    ];

    const expectedMap = {
      USD: {
        EUR: {
          "2025-01-01": 1,
          "2025-01-02": 1,
          "2025-01-03": 1,
          "2025-01-04": 1,
          "2025-01-05": 1,
        },
      },
    };

    const conversionMap = getConversionMap({ startDate, endDate, results });
    expect(conversionMap).toEqual(expectedMap);
  });

  test("should handle rates outside the specified date range", () => {
    const startDate = "2025-01-02";
    const endDate = "2025-01-04";
    const results = [
      {
        id: "1",
        fromAssetSymbolId: "USD",
        toAssetSymbolId: "EUR",
        rates: [
          { date: "2025-01-01", rate: 0.85, isFinal: true },
          { date: "2025-01-03", rate: 0.86, isFinal: true },
          { date: "2025-01-05", rate: 0.87, isFinal: true },
        ],
      },
    ];

    const expectedMap = {
      USD: {
        EUR: {
          "2025-01-02": 0.85,
          "2025-01-03": 0.86,
          "2025-01-04": 0.86,
        },
      },
    };

    const conversionMap = getConversionMap({ startDate, endDate, results });
    expect(conversionMap).toEqual(expectedMap);
  });
});

describe("convertAmount", () => {
  test("should return the same amount when fromAssetSymbolId is the same as toAssetSymbolId", () => {
    const amount = 100;
    const date = "2025-01-01";
    const fromAssetSymbolId = "USD";
    const toAssetSymbolId = "USD";
    const conversionMap = {};

    const result = convertAmount({
      amount,
      date,
      fromAssetSymbolId,
      toAssetSymbolId,
      conversionMap,
    });

    expect(result).toBe(amount);
  });

  test("should convert amount using direct conversion rate", () => {
    const amount = 100;
    const date = "2025-01-01";
    const fromAssetSymbolId = "USD";
    const toAssetSymbolId = "EUR";
    const conversionMap = {
      USD: {
        EUR: {
          "2025-01-01": 0.85,
        },
      },
    };

    const result = convertAmount({
      amount,
      date,
      fromAssetSymbolId,
      toAssetSymbolId,
      conversionMap,
    });

    expect(result).toBe(amount * 0.85);
  });

  test("should convert amount using reverse conversion rate", () => {
    const amount = 100;
    const date = "2025-01-01";
    const fromAssetSymbolId = "USD";
    const toAssetSymbolId = "EUR";
    const conversionMap = {
      EUR: {
        USD: {
          "2025-01-01": 1.17647, // 1/0.85
        },
      },
    };

    const result = convertAmount({
      amount,
      date,
      fromAssetSymbolId,
      toAssetSymbolId,
      conversionMap,
    });

    expect(result).toBeCloseTo(amount / 1.17647);
  });

  test("should return the same amount when conversion rate is not available", () => {
    const amount = 100;
    const date = "2025-01-01";
    const fromAssetSymbolId = "USD";
    const toAssetSymbolId = "EUR";
    const conversionMap = {};

    const result = convertAmount({
      amount,
      date,
      fromAssetSymbolId,
      toAssetSymbolId,
      conversionMap,
    });

    expect(result).toBe(amount);
  });

  test("should handle missing conversion rate gracefully", () => {
    const amount = 100;
    const date = "2025-01-01";
    const fromAssetSymbolId = "USD";
    const toAssetSymbolId = "EUR";
    const conversionMap = {
      USD: {
        EUR: {},
      },
    };

    const result = convertAmount({
      amount,
      date,
      fromAssetSymbolId,
      toAssetSymbolId,
      conversionMap,
    });

    expect(result).toBe(amount);
  });
});
