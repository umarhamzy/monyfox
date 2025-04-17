import { createContext } from "react";
import { LocalDate } from "@js-joda/core";
import type {
  Data,
  Account,
  Transaction,
  AssetSymbol,
  AssetSymbolExchange,
} from "@monyfox/common-data";
import { MutationResult } from "./profile-provider";

interface ProfileContextProps {
  user: { id: string; name: string };
  data: Data;

  // Accounts
  getAccount: (accountId: string) => Account;
  createAccount: MutationResult<Account>;
  deleteAccount: MutationResult<string>;

  // Transactions
  createTransaction: MutationResult<Transaction>;
  updateTransaction: MutationResult<Transaction>;
  deleteTransaction: MutationResult<string>;
  getTransactionsBetweenDates: (
    startDate: LocalDate,
    endDate: LocalDate,
  ) => Transaction[];

  // Symbols
  getAssetSymbol: (assetSymbolId: string) => AssetSymbol;
  getTransactionCountBySymbol: (symbolId: string) => number;
  createAssetSymbol: MutationResult<AssetSymbol>;
  deleteAssetSymbol: MutationResult<string>;
  createAssetSymbolWithExchange: MutationResult<{
    assetSymbol: AssetSymbol;
    assetSymbolExchange: AssetSymbolExchange;
  }>;
  createAssetSymbolExchange: MutationResult<AssetSymbolExchange>;
  deleteAssetSymbolExchange: MutationResult<string>;
  updateAlphaVantageApiKey: MutationResult<string | null>;
}

export const ProfileContext = createContext<ProfileContextProps | undefined>(
  undefined,
);
