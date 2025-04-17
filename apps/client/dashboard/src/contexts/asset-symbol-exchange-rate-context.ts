import { createContext } from "react";
import { type AlphaVantageSymbolExchangeClient } from "@monyfox/common-symbol-exchange";
import { UseMutationResult } from "@tanstack/react-query";

type MutationResult<Request, Response> = UseMutationResult<
  Response,
  Error,
  Request,
  unknown
>;

export type ConvertAmountsArgs = {
  amount: number;
  date: string;
  fromAssetSymbolId: string;
  toAssetSymbolId: string;
};

export type SearchStocksResult = Awaited<
  ReturnType<AlphaVantageSymbolExchangeClient["searchSymbol"]>
>;

interface AssetSymbolExchangeRateContextProps {
  isLoading: boolean;
  error: string | null;
  convertAmount: (args: ConvertAmountsArgs) => number;
  searchStocks: MutationResult<string, SearchStocksResult>;
}
export const AssetSymbolExchangeRateContext = createContext<
  AssetSymbolExchangeRateContextProps | undefined
>(undefined);
