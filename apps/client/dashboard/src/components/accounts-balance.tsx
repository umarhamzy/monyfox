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
      const fromAccount = transaction.from.account;
      const isFromPersonalAsset =
        "id" in fromAccount && getAccount(fromAccount.id).isPersonalAsset;
      if (isFromPersonalAsset) {
        const accountId = fromAccount.id;
        const amount = transaction.from.amount;
        balanceByAccount.set(
          accountId,
          (balanceByAccount.get(accountId) || 0) - amount,
        );
      }

      const toAccount = transaction.to.account;
      const isToPersonalAsset =
        "id" in toAccount && getAccount(toAccount.id).isPersonalAsset;
      if (isToPersonalAsset) {
        const accountId = toAccount.id;
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
          <TableCell className="text-right">
            {formatCurrency(totalBalance)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
