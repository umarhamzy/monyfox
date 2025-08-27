import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModal } from "@/components/ui/modal";
import { useProfile } from "@/hooks/use-profile";
import { type Account } from "@monyfox/common-data";
import { PencilIcon } from "lucide-react";
import { AccountFormModal } from "./account-form-modal";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { formatCurrency } from "@/utils/currency";
import { useAssetSymbolExchangeRate } from "@/hooks/use-asset-symbol-exchange-rate";
import { useSettings } from "@/hooks/use-settings";
import { LocalDate } from "@js-joda/core";

export function AccountCard({ account }: { account: Account }) {
  const { getTransactionCountByAccount } = useProfile();
  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const transactionsCount = getTransactionCountByAccount(account.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle>{account.name}</CardTitle>
            <CardDescription>{transactionsCount} transactions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              onClick={openEditModal}
              variant="outline"
              title="Edit"
            >
              <PencilIcon />
            </Button>
          </div>
          <AccountFormModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            account={account}
          />
        </div>
      </CardHeader>
      <CardContent>
        <AccountBalanceTable account={account} />
      </CardContent>
    </Card>
  );
}

function AccountBalanceTable({ account }: { account: Account }) {
  const today = LocalDate.now().toString();
  const { defaultSymbolId } = useSettings();
  const { getBalanceByAccount, getAssetSymbol } = useProfile();
  const { convertAmount } = useAssetSymbolExchangeRate();
  const balances = getBalanceByAccount(account.id).map(
    ({ symbolId, balance }) => ({
      originalBalance: balance,
      originalSymbol: getAssetSymbol(symbolId),
      convertedBalance: convertAmount({
        amount: balance,
        date: today,
        fromAssetSymbolId: symbolId,
        toAssetSymbolId: defaultSymbolId,
      }),
    }),
  );
  const convertedSymbol = getAssetSymbol(defaultSymbolId);
  const convertedTotal = balances.reduce(
    (acc, { convertedBalance }) => acc + convertedBalance,
    0,
  );

  return (
    <Table>
      <TableBody>
        {balances.map(
          ({ originalBalance, originalSymbol, convertedBalance }) => (
            <TableRow key={`${account.id}-${originalSymbol.code}`}>
              <TableCell>{originalSymbol.code}</TableCell>
              <TableCell className="text-right">
                {originalSymbol.id !== convertedSymbol.id &&
                  formatCurrency(originalBalance, originalSymbol)}
              </TableCell>
              <TableCell className="text-right w-[100px]">
                {formatCurrency(convertedBalance, convertedSymbol)}
              </TableCell>
            </TableRow>
          ),
        )}
        {balances.length > 1 && (
          <TableRow className="font-bold">
            <TableCell>Total</TableCell>
            <TableCell className="text-right" />
            <TableCell className="text-right w-[100px]">
              {formatCurrency(convertedTotal, convertedSymbol)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
