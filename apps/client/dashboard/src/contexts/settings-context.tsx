import { DestructiveAlert } from "@/components/ui/alert";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useProfile } from "@/hooks/use-profile";
import { createContext } from "react";
import { z } from "zod";

type SettingContextProps = {
  defaultSymbolId: string;
  setDefaultSymbolId: React.Dispatch<React.SetStateAction<string>>;
};

export const SettingsContext = createContext<SettingContextProps | undefined>(
  undefined,
);

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
  let fallbackSymbolId = assetSymbols.length > 0 ? assetSymbols[0].id : "";

  const [defaultSymbolId, setDefaultSymbolId] = useLocalStorage(
    defaultSymbolIdKey,
    fallbackSymbolId,
    z.string(),
  );

  if (defaultSymbolId === null) {
    return (
      <DestructiveAlert title="Error">
        An error occured while trying to load the default symbol.
      </DestructiveAlert>
    );
  }

  if (
    defaultSymbolId !== fallbackSymbolId &&
    !assetSymbols.find((symbol) => symbol.id === defaultSymbolId)
  ) {
    setDefaultSymbolId(fallbackSymbolId);
  }

  return (
    <SettingsContext.Provider
      value={{
        defaultSymbolId,
        setDefaultSymbolId: (a) => {
          console.log(a);
          setDefaultSymbolId(a);
        },
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
