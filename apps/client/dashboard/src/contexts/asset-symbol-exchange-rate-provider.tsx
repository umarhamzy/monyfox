import { useMutation, useQueries } from "@tanstack/react-query";
import { ReactNode, useCallback, useMemo } from "react";
import {
  AlphaVantageSymbolExchangeClient,
  FrankfurterSymbolExchangeClient,
  type GetExchangeRateResponse,
  type SymbolExchangeClient,
} from "@monyfox/common-symbol-exchange";
import { useProfile } from "@/hooks/use-profile";
import { getStartAndEndDate } from "@/utils/transaction";
import { SymbolConverter } from "@/utils/symbol-converter";
import { notEmpty } from "@/utils/array";
import { LocalDate } from "@js-joda/core";
import { useStable } from "@/hooks/use-stable";
import {
  AssetSymbolExchangeRateContext,
  ConvertAmountsArgs,
} from "./asset-symbol-exchange-rate-context";
import { maxLocalDate } from "@/utils/datetime";
import { useDatabase } from "@/hooks/use-database";

export const AssetSymbolExchangeRateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    data: { transactions, assetSymbolExchanges, assetSymbolExchangersMetadata },
  } = useProfile();
  const {
    exchangeRates: exchangeRatesCache,
    saveExchangeRatesAsync: saveExchangeRatesCache,
  } = useDatabase();
  const { startDate, endDate: endDateFromTransactions } = useMemo(
    () => getStartAndEndDate(transactions),
    [transactions],
  );

  const frankfurterClient = useMemo(
    () => new FrankfurterSymbolExchangeClient(),
    [],
  );

  const alphaVantageClient = useMemo(
    () =>
      new AlphaVantageSymbolExchangeClient({
        apiKey: assetSymbolExchangersMetadata.alphavantage?.apiKey ?? "",
      }),
    [assetSymbolExchangersMetadata.alphavantage?.apiKey],
  );

  const exchangeRatesCacheById = useMemo(
    () => new Map(exchangeRatesCache.map((e) => [e.id, e])),
    [exchangeRatesCache],
  );

  // The end date should be the maximum of:
  // - the end date of the transactions (to show the value at that time);
  // - today (to show the current balance).
  const endDate = useMemo(
    () =>
      maxLocalDate(
        LocalDate.parse(endDateFromTransactions),
        LocalDate.now(),
      ).toString(),
    [endDateFromTransactions],
  );

  const queries = useQueries({
    queries: assetSymbolExchanges.map((e) => ({
      queryKey: ["asset-symbol-exchange-rate", e.id, startDate, endDate],
      queryFn: async () => {
        let client: SymbolExchangeClient;
        let from: string;
        let to: string;

        switch (e.exchanger.type) {
          case "frankfurter":
            client = frankfurterClient;
            from = e.exchanger.base;
            to = e.exchanger.target;
            break;
          case "alphavantage-stock":
            client = alphaVantageClient;
            from = e.exchanger.symbol;
            to = "";
            break;
          default:
            throw new Error(`Unknown exchanger type: ${e.exchanger}`);
        }

        let rates: GetExchangeRateResponse = [];

        const cached = exchangeRatesCacheById.get(e.id);
        const hasCache = cached !== undefined;
        const isRequestedDateRangeCached =
          hasCache &&
          cached.startDate === startDate &&
          cached.endDate === endDate;
        if (isRequestedDateRangeCached) {
          rates = cached.data;
        } else {
          try {
            rates = await client.getExchangeRates({
              from,
              to,
              startDate,
              endDate,
            });
            await saveExchangeRatesCache({
              id: e.id,
              startDate,
              endDate,
              data: rates,
              updatedAt: new Date().toISOString(),
            });
          } catch (error) {
            if (hasCache) {
              // If the request fails, fallback to the cache even if the data is stale.
              rates = cached.data;
            } else {
              console.error(error);
              throw error;
            }
          }
        }

        return {
          id: e.id,
          fromAssetSymbolId: e.fromAssetSymbolId,
          toAssetSymbolId: e.toAssetSymbolId,
          rates,
        };
      },
    })),
  });
  const stableQueries = useStable(
    // Only stabilize what we use better performance.
    queries.map((q) => ({ data: q.data, isLoading: q.isLoading })),
  );

  // fromAssetSymbolId (string) -> toAssetSymbolId (string) -> date (string) -> rate (number)
  const symbolConverter = useMemo(() => {
    const isLoading = stableQueries.some((q) => q.isLoading);
    if (isLoading) {
      // Do not compute conversion map if data is not ready.
      return new SymbolConverter({
        startDate,
        endDate,
        results: [],
      });
    }

    // Compute conversion map even if some queries failed.
    const availableData = stableQueries.map((q) => q.data).filter(notEmpty);
    return new SymbolConverter({
      startDate,
      endDate,
      results: availableData,
    });
  }, [stableQueries, startDate, endDate]);

  const convertAmountFn = useCallback(
    ({
      amount,
      date,
      fromAssetSymbolId,
      toAssetSymbolId,
    }: ConvertAmountsArgs) => {
      return (
        symbolConverter.convertAmount({
          amount,
          date,
          fromAssetSymbolId,
          toAssetSymbolId,
        }) ?? amount
      );
    },
    [symbolConverter],
  );

  const searchStocksFn = useMutation({
    mutationFn: (symbol: string) => alphaVantageClient.searchSymbol({ symbol }),
  });

  const errors = queries.filter((q) => q.error !== null);
  const error =
    errors.length > 0 ? errors.map((q) => q.error).join(", ") : null;
  const isLoading = queries.some((q) => q.isPending);

  return (
    <AssetSymbolExchangeRateContext.Provider
      value={{
        isLoading,
        error,
        convertAmount: convertAmountFn,
        searchStocks: searchStocksFn,
      }}
    >
      {children}
    </AssetSymbolExchangeRateContext.Provider>
  );
};
