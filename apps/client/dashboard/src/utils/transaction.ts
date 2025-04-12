import { LocalDate, YearMonth } from "@js-joda/core";
import { type Account, type Transaction } from "@monyfox/common-data";

export enum TransactionType {
  Unknown = "unknown",
  Income = "income",
  Expense = "expense",
  Transfer = "transfer",
}

export function getTransactionType(
  transaction: Transaction,
  getAccount: (accountId: string) => Account,
) {
  const isFromPersonalAsset =
    "id" in transaction.from.account &&
    getAccount(transaction.from.account.id).isPersonalAsset;

  const isToPersonalAsset =
    "id" in transaction.to.account &&
    getAccount(transaction.to.account.id).isPersonalAsset;

  if (isFromPersonalAsset && isToPersonalAsset) {
    return TransactionType.Transfer;
  }

  if (!isFromPersonalAsset && isToPersonalAsset) {
    return TransactionType.Income;
  }

  if (isFromPersonalAsset && !isToPersonalAsset) {
    return TransactionType.Expense;
  }

  console.warn("Unknown transaction type", transaction);
  return TransactionType.Unknown;
}

export function getIncomeExpenseByMonthData({
  transactions,
  startDate,
  endDate,
  getAccount,
  convertAmount,
  defaultSymbolId,
}: {
  transactions: Transaction[];
  startDate: LocalDate;
  endDate: LocalDate;
  getAccount: (accountId: string) => Account;
  convertAmount: (
    amount: number,
    fromAssetSymbolId: string,
    toAssetSymbolId: string,
  ) => number;
  defaultSymbolId: string;
}) {
  const stateByDate = new Map<string, { income: number; expense: number }>();

  for (const transaction of transactions) {
    const transactionType = getTransactionType(transaction, getAccount);

    const isIncome = transactionType === TransactionType.Income;
    const isExpense = transactionType === TransactionType.Expense;

    if (!isIncome && !isExpense) {
      continue;
    }

    const transactionDate = YearMonth.from(
      LocalDate.parse(transaction.accountingDate),
    ).toString();

    if (!stateByDate.has(transactionDate)) {
      stateByDate.set(transactionDate, { income: 0, expense: 0 });
    }

    const state = stateByDate.get(transactionDate)!;
    if (isIncome) {
      state.income += convertAmount(
        transaction.to.amount,
        transaction.to.symbolId,
        defaultSymbolId,
      );
    }
    if (isExpense) {
      state.expense += convertAmount(
        transaction.from.amount,
        transaction.from.symbolId,
        defaultSymbolId,
      );
    }
    stateByDate.set(transactionDate, state);
  }

  const chartData: { date: string; income: number; expense: number }[] = [];
  for (
    let currentMonth = YearMonth.from(startDate);
    currentMonth.isBefore(YearMonth.from(endDate));
    currentMonth = currentMonth.plusMonths(1)
  ) {
    const state = stateByDate.get(currentMonth.toString());
    if (state !== undefined) {
      chartData.push({
        date: currentMonth.toString(),
        income: Math.round(state.income),
        expense: Math.round(state.expense),
      });
    } else {
      chartData.push({
        date: currentMonth.toString(),
        income: 0,
        expense: 0,
      });
    }
  }

  return chartData;
}
