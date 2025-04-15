import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { TestContextProvider } from "@/utils/tests/contexts";
import { useProfile } from "@/hooks/use-profile";
import { ulid } from "ulid";
import { LocalDate } from "@js-joda/core";
import type {
  Data,
  Account,
  Transaction,
  AssetSymbol,
  AssetSymbolExchange,
} from "@monyfox/common-data";
import { MutationResult } from "./profile-provider";

describe("ProfileProvider", () => {
  test("undefined profile", async () => {
    const result = render(
      <TestContextProvider profileId="NON_EXISTING_PROFILE_ID">
        <span>My test text</span>
      </TestContextProvider>,
    );

    expect(result.queryByText("My test text")).toBeNull();
    expect(
      result.getByText("The profile you are trying to access does not exist."),
    ).toBeDefined();
  });

  test("existing profile", async () => {
    const result = render(
      <TestContextProvider>
        <ProfileDataForTest />
      </TestContextProvider>,
    );

    expect(result.getByText("Accounts:Account 1,Account 2.")).toBeDefined();
    expect(result.getByText("Transactions:Income,Expense.")).toBeDefined();
  });
});

function ProfileDataForTest() {
  const {
    data: { accounts, transactions },
    createAccount,
  } = useProfile();
  return (
    <div>
      <p>Accounts:{accounts.map((a) => a.name).join(",")}.</p>
      <p>Transactions:{transactions.map((t) => t.description).join(",")}.</p>
      <button
        onClick={() =>
          createAccount.mutateAsync({
            id: ulid(),
            name: "NewTestAccount",
            isPersonalAsset: true,
          })
        }
      >
        Create Account
      </button>
    </div>
  );
}
export interface ProfileContextProps {
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
  createAssetSymbol: MutationResult<AssetSymbol>;
  deleteAssetSymbol: MutationResult<string>;
  createAssetSymbolExchange: MutationResult<AssetSymbolExchange>;
  deleteAssetSymbolExchange: MutationResult<string>;
}
