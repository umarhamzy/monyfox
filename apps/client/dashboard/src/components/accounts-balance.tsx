import { useProfile } from "@/hooks/use-profile";
import { formatCurrency } from "@/utils/currency";
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { useSettings } from "@/hooks/use-settings";
import { useAssetSymbolExchangeRate } from "@/hooks/use-asset-symbol-exchange-rate";
import { LocalDate } from "@js-joda/core";
import type { Account } from "@monyfox/common-data";

export function AccountsBalance() {
  const { defaultSymbolId } = useSettings();
  const {
    data: { accounts },
    getAccount,
    getAssetSymbol,
    getBalanceByAccount,
  } = useProfile();
  const { convertAmount } = useAssetSymbolExchangeRate();

  const assetSymbol = getAssetSymbol(defaultSymbolId);
  const today = LocalDate.now().toString();

  const balances = useMemo(
    () =>
      accounts
        .filter((a: Account) => a.isPersonalAsset)
        .map((account: Account) => ({
          accountId: account.id,
          balance: getBalanceByAccount(account.id).reduce(
            (acc: number, { symbolId, balance }: { symbolId: string; balance: number }) => {
              return (
                acc +
                convertAmount({
                  amount: balance,
                  date: today,
                  fromAssetSymbolId: symbolId,
                  toAssetSymbolId: defaultSymbolId,
                })
              );
            },
            0,
          ),
        }))
        .sort((a: { accountId: string; balance: number }, b: { accountId: string; balance: number }) => b.balance - a.balance),
    [accounts, getBalanceByAccount, convertAmount, today, defaultSymbolId],
  );

  const totalBalance = useMemo(() => {
    return balances.reduce((acc: number, { balance }: { balance: number }) => acc + balance, 0);
  }, [balances]);

  return (
    <Table>
      <TableBody>
        {balances.map(({ accountId, balance }: { accountId: string; balance: number }) => (
          <TableRow key={accountId}>
            <TableCell className="text-truncate">
              {getAccount(accountId).name}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(balance, assetSymbol)}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-bold">
          <TableCell>Total</TableCell>
          <TableCell className="text-right">
            {formatCurrency(totalBalance, assetSymbol)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}