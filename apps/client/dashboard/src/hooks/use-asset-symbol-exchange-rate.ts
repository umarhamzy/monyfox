import { useContext } from "react";
import { AssetSymbolExchangeRateContext } from "@/contexts/asset-symbol-exchange-rate-context";

export const useAssetSymbolExchangeRate = () => {
  const context = useContext(AssetSymbolExchangeRateContext);
  if (context === undefined) {
    throw new Error(
      "useAssetSymbolExchangeRate must be used within a AssetSymbolExchangeRateProvider",
    );
  }
  return context;
};
