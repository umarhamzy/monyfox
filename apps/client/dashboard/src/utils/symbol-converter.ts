import { LocalDate } from "@js-joda/core";
import { Graph, shortestPath } from "graph-data-structure";
import { type GetExchangeRateResponse } from "@monyfox/common-symbol-exchange";

type Results = {
  id: string;
  fromAssetSymbolId: string;
  toAssetSymbolId: string;
  rates: GetExchangeRateResponse;
}[];

type SymbolId = string;
type LocalDateString = string;
type RateHistory = Map<SymbolId, number>;
type ConversionMap = Map<SymbolId, Map<SymbolId, RateHistory>>;

export class SymbolConverter {
  private conversionMap: ConversionMap;
  private graph = new Graph<SymbolId>();
  private cachedPaths: Map<string, SymbolId[]> = new Map();

  constructor({
    startDate,
    endDate,
    results,
  }: {
    startDate: LocalDateString;
    endDate: LocalDateString;
    results: Results;
  }) {
    this.conversionMap = getCompleteConversionMap({
      startDate: LocalDate.parse(startDate),
      endDate: LocalDate.parse(endDate),
      results,
    });

    this.buildGraph();
  }

  public convertAmount(p: {
    fromAssetSymbolId: SymbolId;
    toAssetSymbolId: SymbolId;
    amount: number;
    date: LocalDateString;
  }) {
    if (
      !this.graph.nodes.has(p.fromAssetSymbolId) ||
      !this.graph.nodes.has(p.toAssetSymbolId)
    ) {
      return null;
    }

    const rate = this.getConversionRate({
      src: p.fromAssetSymbolId,
      dst: p.toAssetSymbolId,
      date: p.date,
    });
    if (rate === null) {
      return null;
    }

    return p.amount * rate;
  }

  private getConversionRate(p: {
    src: SymbolId;
    dst: SymbolId;
    date: LocalDateString;
  }): number | null {
    const { src, dst, date } = p;
    if (src === dst) {
      return 1;
    }

    const path = this.getConversionPath({ src, dst });

    if (path.length < 2) {
      return null;
    }

    let rate = 1;

    for (let i = 0; i < path.length - 1; ++i) {
      const src = path[i];
      const dst = path[i + 1];

      const conversionRate = this.getExistingConversionRate({ src, dst, date });
      if (conversionRate === null) {
        return null;
      }

      rate *= conversionRate;
    }

    return rate;
  }

  private getExistingConversionRate(p: {
    src: SymbolId;
    dst: SymbolId;
    date: LocalDateString;
  }) {
    const { src, dst, date } = p;
    const directRate = this.conversionMap.get(src)?.get(dst)?.get(date);
    if (directRate !== undefined) {
      return directRate;
    }

    const reverseRate = this.conversionMap.get(dst)?.get(src)?.get(date);
    if (reverseRate !== undefined) {
      return 1 / reverseRate;
    }

    // Should never happen because if we have a path, we should have a rate.
    return null;
  }

  private getConversionPath(p: { src: SymbolId; dst: SymbolId }): SymbolId[] {
    const { src, dst } = p;

    const cacheKey = concatenateStrings(src, dst);
    const cachedPath = this.cachedPaths.get(cacheKey);
    if (cachedPath !== undefined) {
      return cachedPath;
    }

    let path: SymbolId[] = [];
    try {
      path = shortestPath(this.graph, src, dst).nodes;
    } catch (e) {
      if (e instanceof Error && e.message === "No path found") {
        path = [];
      } else {
        throw e;
      }
    }

    this.cachedPaths.set(cacheKey, path);
    return path;
  }

  private buildGraph() {
    this.conversionMap.forEach((map, src) => {
      map.forEach((_, dst) => {
        this.graph.addEdge(src, dst).addEdge(dst, src);
      });
    });
  }
}

function getCompleteConversionMap(p: {
  startDate: LocalDate;
  endDate: LocalDate;
  results: Results;
}) {
  const { startDate, endDate, results } = p;
  const data: ConversionMap = new Map();

  results.forEach(({ fromAssetSymbolId, toAssetSymbolId, rates }) => {
    const rateHistory = getCompleteRateHistory({
      startDate,
      endDate,
      rates,
    });

    if (rateHistory) {
      const map = data.get(fromAssetSymbolId) ?? new Map();
      map.set(toAssetSymbolId, rateHistory);
      data.set(fromAssetSymbolId, map);
    }
  });

  return data;
}

/**
 * Returns a map from date (string) to rate (number).
 * The map is filled with the last known rate for each date in the range so
 * that there are no gaps between startDate and endDate.
 * If there are no rates, returns null.
 */
function getCompleteRateHistory({
  startDate,
  endDate,
  rates,
}: {
  startDate: LocalDate;
  endDate: LocalDate;
  rates: GetExchangeRateResponse;
}) {
  const map = new Map<LocalDateString, number>();

  const rateByDate = new Map(rates.map((r: { date: string; rate: number }) => [r.date, r.rate]));

  // Fill in the gaps with the last known rate.
  let lastRate = rates[0]?.rate;

  if (!lastRate) {
    // No rates available, return null.
    return null;
  }

  for (let date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
    const dateString = date.toString();

    const rate = rateByDate.get(dateString) ?? lastRate;
    map.set(dateString, rate);

    lastRate = rate;
  }

  return map;
}

function concatenateStrings(...strings: string[]): string {
  return strings.join("|");
}
