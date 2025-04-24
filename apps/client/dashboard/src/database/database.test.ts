import { describe, expect, test } from "vitest";
import { ExchangeRateDbSchema } from "./database";

describe("ExchangeRateDbSchema", () => {
  test("validate a correct ExchangeRateDb object", () => {
    const validExchangeRateDb = {
      id: "1",
      updatedAt: "2023-10-01T00:00:00Z",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      data: [
        { date: "2023-01-01", rate: 1.2 },
        { date: "2023-01-02", rate: 1.3 },
      ],
    };

    expect(() => ExchangeRateDbSchema.parse(validExchangeRateDb)).not.toThrow();
  });

  test("throw an error for an invalid ExchangeRateDb object", () => {
    const invalidExchangeRateDb = {
      id: "1",
      updatedAt: "2023-10-01T00:00:00Z",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      data: [
        { date: "2023-01-01", rate: "invalid" }, // rate should be a number
      ],
    };

    expect(() => ExchangeRateDbSchema.parse(invalidExchangeRateDb)).toThrow();
  });
});
