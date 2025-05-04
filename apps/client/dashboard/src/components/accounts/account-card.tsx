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
            <Button size="icon" onClick={openEditModal} variant="outline">
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
  const balances = getBalanceByAccount(account.id);

  return (
    <Table>
      <TableBody>
        {balances.map(({ symbolId, balance }) => (
          <TableRow key={symbolId}>
            <TableCell>{getAssetSymbol(symbolId).code}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(balance, getAssetSymbol(symbolId))}
            </TableCell>
            <TableCell className="text-right w-[100px]">
              {formatCurrency(
                convertAmount({
                  amount: balance,
                  date: today,
                  fromAssetSymbolId: symbolId,
                  toAssetSymbolId: defaultSymbolId,
                }),
                getAssetSymbol(defaultSymbolId),
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
