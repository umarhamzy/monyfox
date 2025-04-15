import { useQueries } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useMemo } from "react";
import { FrankfurterSymbolExchangeClient } from "@monyfox/common-symbol-exchange";
import { useProfile } from "@/hooks/use-profile";
import { getStartAndEndDate } from "@/utils/transaction";
import { convertAmount, getConversionMap } from "@/utils/symbol-exchange";
import { notEmpty } from "@/utils/array";
import { LocalDate } from "@js-joda/core";

const client = new FrankfurterSymbolExchangeClient();

type ConvertAmountsArgs = {
  amount: number;
  date: string;
  fromAssetSymbolId: string;
  toAssetSymbolId: string;
};
interface AssetSymbolExchangeRateContextProps {
  isLoading: boolean;
  error: string | null;
  convertAmount: (args: ConvertAmountsArgs) => number;
}

export const AssetSymbolExchangeRateContext = createContext<
  AssetSymbolExchangeRateContextProps | undefined
>(undefined);

export const AssetSymbolExchangeRateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    data: { transactions, assetSymbolExchanges },
  } = useProfile();
  const { startDate } = useMemo(
    () => getStartAndEndDate(transactions),
    [transactions],
  );

  // We always want to get the latest exchange rates to show the current balance.
  const endDate = LocalDate.now().toString();

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

  // fromAssetSymbolId (string) -> toAssetSymbolId (string) -> date (string) -> rate (number)
  const conversionMap = useMemo(() => {
    const isLoading = queries.some((q) => q.isLoading);
    if (isLoading) {
      // Do not compute conversion map if data is not ready.
      return {};
    }

    // Compute conversion map even if some queries failed.
    const availableData = queries.map((q) => q.data).filter(notEmpty);
    return getConversionMap({
      startDate,
      endDate,
      results: availableData,
    });
  }, [queries]);

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
