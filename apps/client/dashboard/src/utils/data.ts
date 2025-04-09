import {
  type Transaction,
  type Account,
  type AssetSymbol,
  type Profile,
} from "@monyfox/common-data";
import { ulid } from "ulid";

export function generateTestProfile(): Profile {
  const bankAccount: Account = {
    id: ulid(),
    name: "My Bank Account",
    isPersonalAsset: true,
  };

  const investmentAccount: Account = {
    id: ulid(),
    name: "My Investment Account",
    isPersonalAsset: true,
  };

  const assetEur: AssetSymbol = {
    id: ulid(),
    type: "currency",
    currency: "EUR",
  };

  const assetUsd: AssetSymbol = {
    id: ulid(),
    type: "currency",
    currency: "USD",
  };

  const transactions: Transaction[] = [
    // Income - salary
    {
      id: ulid(),
      description: "Salary",
      from: {
        accountId: null,
        accountName: "My Company",
        amount: 5000,
        symbolId: assetEur.id,
      },
      to: {
        accountId: bankAccount.id,
        accountName: null,
        amount: 5000,
        symbolId: assetEur.id,
      },
    },
    // Expense - rent
    {
      id: ulid(),
      description: "Rent",
      from: {
        accountId: bankAccount.id,
        accountName: null,
        amount: 1000,
        symbolId: assetEur.id,
      },
      to: {
        accountId: null,
        accountName: "My Landlord",
        amount: 1000,
        symbolId: assetEur.id,
      },
    },
    // Transfer - savings
    {
      id: ulid(),
      description: "Savings",
      from: {
        accountId: bankAccount.id,
        accountName: null,
        amount: 500,
        symbolId: assetEur.id,
      },
      to: {
        accountId: investmentAccount.id,
        accountName: null,
        amount: 500,
        symbolId: assetEur.id,
      },
    },
  ];

  return {
    id: ulid(),
    user: "Test Profile",
    schemaVersion: "1",
    data: {
      encrypted: false,
      data: {
        accounts: [bankAccount, investmentAccount],
        transactions,
        assetSymbols: [assetEur, assetUsd],
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}
