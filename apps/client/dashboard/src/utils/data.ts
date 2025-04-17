import {
  type Transaction,
  type Account,
  type AssetSymbol,
  type Profile,
} from "@monyfox/common-data";
import { ulid } from "ulid";
import { DayOfWeek, LocalDate, Month } from "@js-joda/core";

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
    type: "fiat",
    code: "EUR",
    displayName: "EUR",
  };

  const yearsToGenerate = 2;
  const transactions: Transaction[] = [];
  for (
    let currentDate = LocalDate.now().minusYears(yearsToGenerate);
    currentDate.isBefore(LocalDate.now());
    currentDate = currentDate.plusDays(1)
  ) {
    if (currentDate.dayOfMonth() === 1) {
      // Income - salary
      const salaryAmount = randomFloat(0.9, 1.1) * 5000; // Variance for salary
      transactions.push({
        id: ulid(),
        description: "Salary",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: salaryAmount,
          symbolId: assetEur.id,
          account: { name: "My Company" },
        },
        to: {
          amount: salaryAmount,
          symbolId: assetEur.id,
          account: { id: bankAccount.id },
        },
      });

      // Expense - rent
      const rentAmount = randomFloat(0.9, 1.1) * 1000; // Variance for bills
      transactions.push({
        id: ulid(),
        description: "Rent",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: rentAmount,
          symbolId: assetEur.id,
          account: { id: bankAccount.id },
        },
        to: {
          amount: rentAmount,
          symbolId: assetEur.id,
          account: { name: "My Landlord" },
        },
      });

      // Transfer - investment
      transactions.push({
        id: ulid(),
        description: "Investment",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: 500,
          symbolId: assetEur.id,
          account: { id: bankAccount.id },
        },
        to: {
          amount: 500,
          symbolId: assetEur.id,
          account: { id: investmentAccount.id },
        },
      });
    }

    if (
      currentDate.month() === Month.DECEMBER &&
      currentDate.dayOfMonth() === 15
    ) {
      // Income - bonus
      const bonusAmount = randomFloat(0.8, 2.0) * 10000;
      transactions.push({
        id: ulid(),
        description: "Bonus",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: bonusAmount,
          symbolId: assetEur.id,
          account: { name: "My Company" },
        },
        to: {
          amount: bonusAmount,
          symbolId: assetEur.id,
          account: { id: bankAccount.id },
        },
      });
    }

    if (
      (currentDate.dayOfWeek() === DayOfWeek.SATURDAY ||
        currentDate.dayOfWeek() === DayOfWeek.SUNDAY) &&
      Math.random() > 0.5
    ) {
      // Expense - entertainment
      const entertainmentAmount = randomFloat(0.1, 3) * 100;
      transactions.push({
        id: ulid(),
        description: "Entertainment",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: entertainmentAmount,
          symbolId: assetEur.id,
          account: { id: bankAccount.id },
        },
        to: {
          amount: entertainmentAmount,
          symbolId: assetEur.id,
          account: { name: "Entertainment Shop" },
        },
      });
    }

    transactions.push({
      id: ulid(),
      description: "Coffee",
      transactionDate: currentDate.toString(),
      accountingDate: currentDate.toString(),
      transactionCategoryId: null,
      from: {
        amount: 2,
        symbolId: assetEur.id,
        account: { id: bankAccount.id },
      },
      to: {
        amount: 2,
        symbolId: assetEur.id,
        account: { name: "Coffee Shop" },
      },
    });
  }

  return {
    id: ulid(),
    user: "Test Profile",
    schemaVersion: "1",
    data: {
      encrypted: false,
      data: {
        accounts: [bankAccount, investmentAccount],
        transactions,
        assetSymbols: [assetEur],
        assetSymbolExchanges: [],
        assetSymbolExchangersMetadata: { alphavantage: null },
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
