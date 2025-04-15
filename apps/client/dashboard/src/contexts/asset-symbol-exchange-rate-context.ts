import { createContext } from "react";

export type ConvertAmountsArgs = {
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
