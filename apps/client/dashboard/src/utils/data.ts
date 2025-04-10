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
    type: "currency",
    currency: "EUR",
  };

  const yearsToGenerate = 2;
  const monthsToGenerate = 12 * yearsToGenerate;
  const daysToGenerate = 30 * monthsToGenerate;
  const transactions: Transaction[] = [];
  for (
    let currentDate = LocalDate.now().minusDays(daysToGenerate);
    currentDate.isBefore(LocalDate.now());
    currentDate = currentDate.plusDays(1)
  ) {
    if (currentDate.dayOfMonth() === 1) {
      // Income - salary
      const salaryAmount = randomFloat(0.9, 1.1) * 5000; // Variance for salary
      transactions.push({
        id: ulid(),
        description: "Salary",
        date: currentDate.toString(),
        from: {
          accountId: null,
          accountName: "My Company",
          amount: salaryAmount,
          symbolId: assetEur.id,
        },
        to: {
          accountId: bankAccount.id,
          accountName: null,
          amount: salaryAmount,
          symbolId: assetEur.id,
        },
      });

      // Expense - rent
      const rentAmount = randomFloat(0.9, 1.1) * 1000; // Variance for bills
      transactions.push({
        id: ulid(),
        description: "Rent",
        date: currentDate.toString(),
        from: {
          accountId: bankAccount.id,
          accountName: null,
          amount: rentAmount,
          symbolId: assetEur.id,
        },
        to: {
          accountId: null,
          accountName: "My Landlord",
          amount: rentAmount,
          symbolId: assetEur.id,
        },
      });

      // Transfer - investment
      transactions.push({
        id: ulid(),
        description: "Investment",
        date: currentDate.toString(),
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
        date: currentDate.toString(),
        from: {
          accountId: null,
          accountName: "My Company",
          amount: bonusAmount,
          symbolId: assetEur.id,
        },
        to: {
          accountId: bankAccount.id,
          accountName: null,
          amount: bonusAmount,
          symbolId: assetEur.id,
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
        date: currentDate.toString(),
        from: {
          accountId: bankAccount.id,
          accountName: null,
          amount: entertainmentAmount,
          symbolId: assetEur.id,
        },
        to: {
          accountId: null,
          accountName: "Entertainment Shop",
          amount: entertainmentAmount,
          symbolId: assetEur.id,
        },
      });
    }

    transactions.push({
      id: ulid(),
      description: "Coffee",
      date: currentDate.toString(),
      from: {
        accountId: bankAccount.id,
        accountName: null,
        amount: 2,
        symbolId: assetEur.id,
      },
      to: {
        accountId: null,
        accountName: "Coffee Shop",
        amount: 2,
        symbolId: assetEur.id,
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
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
