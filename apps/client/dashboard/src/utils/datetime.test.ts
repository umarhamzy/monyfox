import { LocalDate } from "@js-joda/core";
import { maxLocalDate, yearMonthToLocalMonthYear } from "./datetime";
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

describe("yearMonthToLocalMonthYear", () => {
  // TODO: set the locale to a fixed value and check the exact string
  test("returns correct month and year for January", () => {
    const startDate = LocalDate.of(2023, 1, 1);
    const result = yearMonthToLocalMonthYear("2023-01", startDate);
    expect(result).toContain("2023"); // May 2023
  });

  test("returns correct month for other months", () => {
    const startDate = LocalDate.of(2023, 1, 1);
    const result = yearMonthToLocalMonthYear("2023-05", startDate);
    expect(result).not.toContain("2023"); // May
  });

  test("returns correct month and year for start date", () => {
    const startDate = LocalDate.of(2023, 1, 1);
    const result = yearMonthToLocalMonthYear("2023-01", startDate);
    expect(result).toContain("2023"); // Jan 2023
  });

  test("returns correct month for non-start date", () => {
    const startDate = LocalDate.of(2023, 1, 1);
    const result = yearMonthToLocalMonthYear("2023-05", startDate);
    expect(result).not.toContain("2023"); // May
  });
});
