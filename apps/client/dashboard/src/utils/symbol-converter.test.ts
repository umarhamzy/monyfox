import { beforeEach, describe, expect, test } from "vitest";
import { SymbolConverter } from "./symbol-converter";

describe("convertAmount", () => {
  const amount = 100;

  const existingDate = "2025-01-10";

  const startDate = "2025-01-01";
  const endDate = "2025-01-31";

  const mockResults = [
    {
      id: "1",
      fromAssetSymbolId: "CUR1",
      toAssetSymbolId: "CUR2",
      rates: [
        { date: existingDate, rate: 0.9 },
        { date: "2025-01-11", rate: 0.95 },
      ],
    },
    {
      id: "2",
      fromAssetSymbolId: "CUR3",
      toAssetSymbolId: "CUR2",
      rates: [
        { date: existingDate, rate: 0.8 },
        { date: "2025-01-02", rate: 0.85 },
      ],
    },
    {
      id: "3",
      fromAssetSymbolId: "CUR10",
      toAssetSymbolId: "CUR11",
      rates: [
        { date: existingDate, rate: 0.7 },
        { date: "2025-01-02", rate: 0.71 },
      ],
    },
    {
      id: "4",
      fromAssetSymbolId: "CUR11",
      toAssetSymbolId: "CUR12",
      rates: [
        { date: existingDate, rate: 0.6 },
        { date: "2025-01-02", rate: 0.61 },
      ],
    },
    {
      id: "5",
      fromAssetSymbolId: "CUR20",
      toAssetSymbolId: "CUR21",
      rates: [{ date: existingDate, rate: 1.5 }],
    },
    {
      id: "6",
      fromAssetSymbolId: "CUR21",
      toAssetSymbolId: "CUR22",
      rates: [{ date: existingDate, rate: 1.6 }],
    },
    {
      id: "7",
      fromAssetSymbolId: "CUR23",
      toAssetSymbolId: "CUR22",
      rates: [{ date: existingDate, rate: 1.7 }],
    },
    {
      id: "8",
      fromAssetSymbolId: "CUR23",
      toAssetSymbolId: "CUR24",
      rates: [{ date: existingDate, rate: 1.8 }],
    },
  ];

  let converter: SymbolConverter;
  beforeEach(() => {
    converter = new SymbolConverter({
      startDate,
      endDate,
      results: mockResults,
    });
  });

  test("direct conversion", () => {
    const actual = converter.convertAmount({
      fromAssetSymbolId: "CUR1",
      toAssetSymbolId: "CUR2",
      amount,
      date: existingDate,
    });

    expect(actual).toBeCloseTo(amount * 0.9);
  });

  test("direct conversion inverse", () => {
    const actual = converter.convertAmount({
      fromAssetSymbolId: "CUR2",
      toAssetSymbolId: "CUR1",
      amount,
      date: existingDate,
    });

    expect(actual).toBeCloseTo(amount * (1 / 0.9));
  });

  test("indirect conversion", () => {
    const actual = converter.convertAmount({
      fromAssetSymbolId: "CUR1",
      toAssetSymbolId: "CUR3",
      amount,
      date: existingDate,
    });

    expect(actual).toBeCloseTo(amount * 0.9 * (1 / 0.8)); // CUR1 -> CUR2 -> CUR3

    // Check cache
    const actualCached = converter.convertAmount({
      fromAssetSymbolId: "CUR1",
      toAssetSymbolId: "CUR3",
      amount,
      date: existingDate,
    });

    expect(actualCached).toBeCloseTo(amount * 0.9 * (1 / 0.8)); // CUR1 -> CUR2 -> CUR3
  });

  test("indirect long conversion", () => {
    const actual = converter.convertAmount({
      fromAssetSymbolId: "CUR20",
      toAssetSymbolId: "CUR24",
      amount,
      date: existingDate,
    });

    expect(actual).toBeCloseTo(amount * 1.5 * 1.6 * (1 / 1.7) * 1.8);

    // Check cache
    const actualCached = converter.convertAmount({
      fromAssetSymbolId: "CUR20",
      toAssetSymbolId: "CUR24",
      amount,
      date: existingDate,
    });

    expect(actualCached).toBeCloseTo(amount * 1.5 * 1.6 * (1 / 1.7) * 1.8);
  });

  test("non-existent source", () => {
    const actual = converter.convertAmount({
      fromAssetSymbolId: "NON_EXISTENT",
      toAssetSymbolId: "CUR2",
      amount,
      date: existingDate,
    });

    expect(actual).toBeNull();
  });

  test("non-existent destination", () => {
    const actual = converter.convertAmount({
      fromAssetSymbolId: "CUR2",
      toAssetSymbolId: "NON_EXISTENT",
      amount,
      date: existingDate,
    });

    expect(actual).toBeNull();
  });

  test("non-existent conversion path", () => {
    const actual = converter.convertAmount({
      fromAssetSymbolId: "CUR1",
      toAssetSymbolId: "CUR10",
      amount,
      date: existingDate,
    });

    expect(actual).toBeNull();
  });

  test("same symbol", () => {
    const actual = converter.convertAmount({
      fromAssetSymbolId: "CUR1",
      toAssetSymbolId: "CUR1",
      amount,
      date: existingDate,
    });

    expect(actual).toBe(amount);
  });
});
