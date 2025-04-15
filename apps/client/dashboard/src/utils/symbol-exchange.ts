import { LocalDate } from "@js-joda/core";
import { type GetExchangeRateResponse } from "@monyfox/common-symbol-exchange/dist/client";

type ConversionMap = Record<string, Record<string, Record<string, number>>>;
export function getConversionMap({
  startDate,
  endDate,
  results,
}: {
  startDate: string;
  endDate: string;
  results: {
    id: string;
    fromAssetSymbolId: string;
    toAssetSymbolId: string;
    rates: GetExchangeRateResponse;
  }[];
}) {
  // fromAssetSymbolId (string) -> toAssetSymbolId (string) -> date (string) -> rate (number)
  const map: ConversionMap = {};

  results.forEach((r) => {
    const { fromAssetSymbolId, toAssetSymbolId, rates } = r;
    map[fromAssetSymbolId] = map[fromAssetSymbolId] ?? {};
    map[fromAssetSymbolId][toAssetSymbolId] =
      map[fromAssetSymbolId][toAssetSymbolId] ??
      getConversionMapForSymbolPair({
        startDate: LocalDate.parse(startDate),
        endDate: LocalDate.parse(endDate),
        rates,
      });
  });

  return map;
}

function getConversionMapForSymbolPair({
  startDate,
  endDate,
  rates,
}: {
  startDate: LocalDate;
  endDate: LocalDate;
  rates: GetExchangeRateResponse;
}) {
  // date (string) -> rate (number)
  const map: Record<string, number> = {};

  const rateByDate = new Map(rates.map((r) => [r.date, r.rate]));

  // Fill in the gaps with the last known rate.
  // If there are no rates, use 1 as the default rate.
  let lastRate = rates[0]?.rate ?? 1;
  for (let date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
    const dateString = date.toString();

    const rate = rateByDate.get(dateString);
    map[dateString] = rate !== undefined ? rate : lastRate;
    if (rate !== undefined) {
      lastRate = rate;
    }
  }

  return map;
}

export const convertAmount = ({
  amount,
  date,
  fromAssetSymbolId,
  toAssetSymbolId,
  conversionMap,
}: {
  amount: number;
  date: string;
  fromAssetSymbolId: string;
  toAssetSymbolId: string;
  conversionMap: ConversionMap;
}) => {
  if (fromAssetSymbolId === toAssetSymbolId) {
    return amount;
  }

  let rate = conversionMap[fromAssetSymbolId]?.[toAssetSymbolId]?.[date];
  if (rate !== undefined) {
    return amount * rate;
  }

  rate = conversionMap[toAssetSymbolId]?.[fromAssetSymbolId]?.[date];
  if (rate !== undefined) {
    return amount / rate;
  }

  return amount;
};
