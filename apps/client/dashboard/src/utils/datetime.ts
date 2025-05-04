import { LocalDate, YearMonth } from "@js-joda/core";
import { format } from "date-fns";

export function maxLocalDate(...dates: LocalDate[]): LocalDate {
  return dates.reduce((max, date) => (date.isAfter(max) ? date : max));
}

export function yearMonthToLocalMonthYear(yearMonth: string, startDate: LocalDate) {
  const startYearMonth = YearMonth.from(startDate);
  const [, month] = yearMonth.split("-").map(Number);

  if (month === 1 || yearMonth === startYearMonth.toString()) {
    // Use 15th of the month to get the correct month name (avoiding timezone issues)
    return format(yearMonth + "-15", "MMM yyyy");
  }

  // Use 15th of the month to get the correct month name (avoiding timezone issues)
  return format(yearMonth + "-15", "MMM");
}