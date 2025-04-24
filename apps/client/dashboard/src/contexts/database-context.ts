import { createContext } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { type Profile } from "@monyfox/common-data";
import { type ExchangeRateDb } from "@/database/database";

interface DatabaseContextProps {
  profiles: Profile[];
  saveProfile: UseMutationResult<void, Error, Profile, unknown>;
  deleteProfile: UseMutationResult<void, Error, string, unknown>;
  exchangeRates: ExchangeRateDb[];
  saveExchangeRatesAsync: (_: ExchangeRateDb) => Promise<void>;
}

export const DatabaseContext = createContext<DatabaseContextProps | undefined>(
  undefined,
);
