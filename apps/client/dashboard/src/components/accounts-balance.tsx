import { useProfile } from "@/hooks/use-profile";
import { formatCurrency } from "@/utils/currency";
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

export function AccountsBalance() {
  const {
    data: { transactions },
    getAccount,
  } = useProfile();

  const balances = useMemo(() => {
    const balanceByAccount = new Map<string, number>();
    for (const transaction of transactions) {
      const fromAccountId = transaction.from.accountId;
      const isFromPersonalAsset =
        fromAccountId !== null && getAccount(fromAccountId).isPersonalAsset;
      if (isFromPersonalAsset) {
        const accountId = fromAccountId;
        const amount = transaction.from.amount;
        balanceByAccount.set(
          accountId,
          (balanceByAccount.get(accountId) || 0) - amount,
        );
      }

      const toAccountId = transaction.to.accountId;
      const isToPersonalAsset =
        toAccountId !== null && getAccount(toAccountId).isPersonalAsset;
      if (isToPersonalAsset) {
        const accountId = toAccountId;
        const amount = transaction.to.amount;
        balanceByAccount.set(
          accountId,
          (balanceByAccount.get(accountId) || 0) + amount,
        );
      }
    }

    return Array.from(balanceByAccount.entries()).map(
      ([accountId, balance]) => ({
        accountId,
        balance,
      }),
    );
  }, [getAccount, transactions]);

  const totalBalance = useMemo(() => {
    return balances.reduce((acc, { balance }) => acc + balance, 0);
  }, [balances]);

  return (
    <Table>
      <TableBody>
        {balances.map(({ accountId, balance }) => (
          <TableRow key={accountId}>
            <TableCell>{getAccount(accountId).name}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(balance)}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-bold">
          <TableCell>Total</TableCell>
          <TableCell className="text-right">{formatCurrency(totalBalance)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
