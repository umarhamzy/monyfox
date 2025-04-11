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
