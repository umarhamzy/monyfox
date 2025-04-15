import { useProfile } from "@/hooks/use-profile";
import { formatCurrency } from "@/utils/currency";
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import { useAssetSymbolExchangeRate } from "@/hooks/use-asset-symbol-exchange-rate";
import { LocalDate } from "@js-joda/core";

export function AccountsBalance() {
  const { defaultSymbolId } = useSettings();
  const {
    data: { transactions },
    getAccount,
    getAssetSymbol,
  } = useProfile();
  const { convertAmount } = useAssetSymbolExchangeRate();

  const assetSymbol = getAssetSymbol(defaultSymbolId);
  const today = LocalDate.now().toString();

  const balances = useMemo(() => {
    const balanceByAccount = new Map<string, number>();
    for (const transaction of transactions) {
      const fromAccount = transaction.from.account;
      const isFromPersonalAsset =
        "id" in fromAccount && getAccount(fromAccount.id).isPersonalAsset;
      if (isFromPersonalAsset) {
        const accountId = fromAccount.id;
        const amount = convertAmount({
          amount: transaction.from.amount,
          date: today,
          fromAssetSymbolId: transaction.from.symbolId,
          toAssetSymbolId: defaultSymbolId,
        });
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
        const amount = convertAmount({
          amount: transaction.to.amount,
          date: today,
          fromAssetSymbolId: transaction.to.symbolId,
          toAssetSymbolId: defaultSymbolId,
        });
        balanceByAccount.set(
          accountId,
          (balanceByAccount.get(accountId) || 0) + amount,
        );
      }
    }

    return Array.from(balanceByAccount.entries())
      .map(([accountId, balance]) => ({
        accountId,
        balance,
      }))
      .sort((a, b) => {
        return b.balance - a.balance;
      });
  }, [getAccount, defaultSymbolId, convertAmount, transactions, today]);

  const totalBalance = useMemo(() => {
    return balances.reduce((acc, { balance }) => acc + balance, 0);
  }, [balances]);

  return (
    <Table>
      <TableBody>
        {balances.map(({ accountId, balance }) => (
          <TableRow key={accountId}>
            <TableCell className="text-truncate">
              {getAccount(accountId).name}
            </TableCell>
            <TableCell className="text-right">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {formatCurrency(balance, assetSymbol)}
                      <br />
                      <Progress value={(balance / totalBalance) * 100} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {Math.round((balance / totalBalance) * 100)}%
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
