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
    transaction.from.accountId !== null &&
    getAccount(transaction.from.accountId).isPersonalAsset;

  const isToPersonalAsset =
    transaction.to.accountId !== null &&
    getAccount(transaction.to.accountId).isPersonalAsset;

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
