import { useQueries } from "@tanstack/react-query";
import { ReactNode, useCallback, useMemo } from "react";
import { FrankfurterSymbolExchangeClient } from "@monyfox/common-symbol-exchange";
import { useProfile } from "@/hooks/use-profile";
import { getStartAndEndDate } from "@/utils/transaction";
import { convertAmount, getConversionMap } from "@/utils/symbol-exchange";
import { notEmpty } from "@/utils/array";
import { LocalDate } from "@js-joda/core";
import { useStable } from "@/hooks/use-stable";
import {
  AssetSymbolExchangeRateContext,
  ConvertAmountsArgs,
} from "./asset-symbol-exchange-rate-context";
import { maxLocalDate } from "@/utils/datetime";

const client = new FrankfurterSymbolExchangeClient();

export const AssetSymbolExchangeRateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    data: { transactions, assetSymbolExchanges },
  } = useProfile();
  const { startDate, endDate: endDateFromTransactions } = useMemo(
    () => getStartAndEndDate(transactions),
    [transactions],
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
        const rates = await client.getExchangeRates({
          from: e.exchanger.base,
          to: e.exchanger.target,
          startDate,
          endDate,
        });
        return {
          id: e.id,
          fromAssetSymbolId: e.fromAssetSymbolId,
          toAssetSymbolId: e.toAssetSymbolId,
          rates,
        };
      },
    })),
  });
  const stableQueries = useStable(queries);

  // fromAssetSymbolId (string) -> toAssetSymbolId (string) -> date (string) -> rate (number)
  const conversionMap = useMemo(() => {
    const isLoading = stableQueries.some((q) => q.isLoading);
    if (isLoading) {
      // Do not compute conversion map if data is not ready.
      return {};
    }

    // Compute conversion map even if some queries failed.
    const availableData = stableQueries.map((q) => q.data).filter(notEmpty);
    return getConversionMap({
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
      return convertAmount({
        amount,
        date,
        fromAssetSymbolId,
        toAssetSymbolId,
        conversionMap,
      });
    },
    [conversionMap],
  );

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
      }}
    >
      {children}
    </AssetSymbolExchangeRateContext.Provider>
  );
};
