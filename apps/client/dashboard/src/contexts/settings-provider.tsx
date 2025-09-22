import { createContext, ReactNode, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useProfile } from "@/hooks/use-profile";
import { DestructiveAlert } from "@/components/ui/alert";
import type { AssetSymbol } from "@monyfox/common-data";
import { z } from "zod";
import { SettingsContext } from "./settings-context";

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    data: { assetSymbols },
    user,
  } = useProfile();
  const defaultSymbolIdKey = `settings-defaultSymbolId-${user.id}`;
  const fallbackSymbolId = assetSymbols.length > 0 ? assetSymbols[0].id : "";

  const [defaultSymbolId, setDefaultSymbolId] = useLocalStorage(
    defaultSymbolIdKey,
    fallbackSymbolId,
    z.string(),
  );

  useEffect(() => {
    if (
      defaultSymbolId !== null &&
      defaultSymbolId !== fallbackSymbolId &&
      !assetSymbols.find((symbol: AssetSymbol) => symbol.id === defaultSymbolId)
    ) {
      setDefaultSymbolId(fallbackSymbolId);
    }
  }, [defaultSymbolId, fallbackSymbolId, assetSymbols, setDefaultSymbolId]);

  if (defaultSymbolId === null) {
    return (
      <DestructiveAlert title="Error">
        An error occured while trying to load the default symbol.
      </DestructiveAlert>
    );
  }

  return (
    <SettingsContext.Provider value={{ defaultSymbolId, setDefaultSymbolId }}>
      {children}
    </SettingsContext.Provider>
  );
};