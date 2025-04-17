import {
  type Transaction,
  type Account,
  type AssetSymbol,
  type Profile,
  type AssetSymbolExchange,
} from "@monyfox/common-data";
import { ulid } from "ulid";
import { DayOfWeek, LocalDate, Month } from "@js-joda/core";

export function generateTestProfile(): Profile {
  const bankAccountEur: Account = {
    id: ulid(),
    name: "Bank Account",
    isPersonalAsset: true,
  };

  const bankAccountUsd: Account = {
    id: ulid(),
    name: "Bank Account (US)",
    isPersonalAsset: true,
  };

  const savingsAccount: Account = {
    id: ulid(),
    name: "Savings Account",
    isPersonalAsset: true,
  };

  const investmentAccount: Account = {
    id: ulid(),
    name: "Investment Account",
    isPersonalAsset: true,
  };

  const creditCardAccount: Account = {
    id: ulid(),
    name: "Credit Card",
    isPersonalAsset: true,
  };

  const assetEur: AssetSymbol = {
    id: ulid(),
    type: "fiat",
    code: "EUR",
    displayName: "EUR",
  };

  const assetUsd: AssetSymbol = {
    id: ulid(),
    type: "fiat",
    code: "USD",
    displayName: "USD",
  };

  const assetIbm: AssetSymbol = {
    id: ulid(),
    type: "stock",
    code: "IBM",
    displayName: "International Business Machines Corporation",
  };

  const exchangeEurUsd: AssetSymbolExchange = {
    id: ulid(),
    fromAssetSymbolId: assetEur.id,
    toAssetSymbolId: assetUsd.id,
    exchanger: { type: "frankfurter", base: "EUR", target: "USD" },
  };

  const exchangeEurIbm: AssetSymbolExchange = {
    id: ulid(),
    fromAssetSymbolId: assetIbm.id,
    toAssetSymbolId: assetEur.id,
    exchanger: {
      type: "alphavantage-stock",
      symbol: "IBM",
    },
  };

  const yearsToGenerate = 2;
  const transactions: Transaction[] = [];
  let creditCardBalance = 0;
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
          account: { id: bankAccountEur.id },
        },
      });

      // Income - stock
      const stockAmount = randomFloat(0.9, 1.1) * 10; // Variance for stock
      transactions.push({
        id: ulid(),
        description: "Vested Stock",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: stockAmount,
          symbolId: assetIbm.id,
          account: { name: "My Company" },
        },
        to: {
          amount: stockAmount,
          symbolId: assetIbm.id,
          account: { id: investmentAccount.id },
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
          account: { id: bankAccountEur.id },
        },
        to: {
          amount: rentAmount,
          symbolId: assetEur.id,
          account: { name: "My Landlord" },
        },
      });

      // Transfer - savings
      transactions.push({
        id: ulid(),
        description: "Savings",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: 3000,
          symbolId: assetEur.id,
          account: { id: bankAccountEur.id },
        },
        to: {
          amount: 3000,
          symbolId: assetEur.id,
          account: { id: savingsAccount.id },
        },
      });

      // Transfer - from EU to US
      transactions.push({
        id: ulid(),
        description: "International Transfer",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: 50,
          symbolId: assetEur.id,
          account: { id: bankAccountEur.id },
        },
        to: {
          amount: 55,
          symbolId: assetUsd.id,
          account: { id: bankAccountUsd.id },
        },
      });

      // Transfer - credit card payment
      const creditCardPaymentAmount = creditCardBalance;
      transactions.push({
        id: ulid(),
        description: "Credit Card Payment",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: creditCardPaymentAmount,
          symbolId: assetEur.id,
          account: { id: bankAccountEur.id },
        },
        to: {
          amount: creditCardPaymentAmount,
          symbolId: assetEur.id,
          account: { id: creditCardAccount.id },
        },
      });
      creditCardBalance = 0;
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
          account: { id: bankAccountEur.id },
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
      creditCardBalance += entertainmentAmount;
      transactions.push({
        id: ulid(),
        description: "Entertainment",
        transactionDate: currentDate.toString(),
        accountingDate: currentDate.toString(),
        transactionCategoryId: null,
        from: {
          amount: entertainmentAmount,
          symbolId: assetEur.id,
          account: { id: creditCardAccount.id },
        },
        to: {
          amount: entertainmentAmount,
          symbolId: assetEur.id,
          account: { name: "Entertainment Shop" },
        },
      });
    }

    // Expense - coffee
    const coffeeAmount = 2;
    creditCardBalance += coffeeAmount;
    transactions.push({
      id: ulid(),
      description: "Coffee",
      transactionDate: currentDate.toString(),
      accountingDate: currentDate.toString(),
      transactionCategoryId: null,
      from: {
        amount: coffeeAmount,
        symbolId: assetEur.id,
        account: { id: creditCardAccount.id },
      },
      to: {
        amount: coffeeAmount,
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
        accounts: [
          bankAccountEur,
          bankAccountUsd,
          creditCardAccount,
          savingsAccount,
          investmentAccount,
        ],
        transactions,
        assetSymbols: [assetEur, assetUsd, assetIbm],
        assetSymbolExchanges: [exchangeEurUsd, exchangeEurIbm],
        assetSymbolExchangersMetadata: { alphavantage: { apiKey: "demo" } },
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
