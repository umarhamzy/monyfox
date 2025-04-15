import { createContext } from "react";

type SettingContextProps = {
  defaultSymbolId: string;
  setDefaultSymbolId: React.Dispatch<React.SetStateAction<string>>;
};

export const SettingsContext = createContext<SettingContextProps | undefined>(
  undefined,
);
