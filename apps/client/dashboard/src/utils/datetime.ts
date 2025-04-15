import { LocalDate } from "@js-joda/core";

export function maxLocalDate(...dates: LocalDate[]): LocalDate {
  return dates.reduce((max, date) => (date.isAfter(max) ? date : max));
}
