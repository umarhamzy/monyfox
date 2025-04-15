import { LocalDate } from "@js-joda/core";
import { maxLocalDate } from "./datetime";
import { describe, expect, test } from "vitest";

describe("maxLocalDate", () => {
  test("should return the latest date from an array of dates", () => {
    const date1 = LocalDate.of(2023, 1, 1);
    const date2 = LocalDate.of(2023, 1, 2);
    const date3 = LocalDate.of(2023, 1, 3);

    const result = maxLocalDate(date1, date2, date3);
    expect(result).toEqual(date3);
  });

  test("should return the same date if only one date is provided", () => {
    const date = LocalDate.of(2023, 1, 1);

    const result = maxLocalDate(date);
    expect(result).toEqual(date);
  });

  test("should handle dates in different orders", () => {
    const date1 = LocalDate.of(2023, 1, 3);
    const date2 = LocalDate.of(2023, 1, 1);
    const date3 = LocalDate.of(2023, 1, 2);

    const result = maxLocalDate(date1, date2, date3);
    expect(result).toEqual(date1);
  });

  test("should return the latest date when dates are the same", () => {
    const date1 = LocalDate.of(2023, 1, 1);
    const date2 = LocalDate.of(2023, 1, 1);

    const result = maxLocalDate(date1, date2);
    expect(result).toEqual(date1);
  });
});
