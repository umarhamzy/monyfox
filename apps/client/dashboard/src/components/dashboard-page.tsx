import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountsBalance } from "@/components/accounts-balance";
import { TransactionsTable } from "@/components/transaction/transactions-table";
import { AddTransactionFloatingButton } from "@/components/transaction/transaction-form";
import { useAssetSymbolExchangeRate } from "@/hooks/use-asset-symbol-exchange-rate";
import { Spinner } from "@/components/ui/spinner";
import { DestructiveAlert } from "@/components/ui/alert";
import { ChartExpenseByCategory } from "@/components/charts/chart-expense-by-category";

export function DashboardPage() {
  const { isLoading, error } = useAssetSymbolExchangeRate();

  return (
    <div className="flex flex-wrap -mx-2 gap-y-4 pb-12 outline-white">
      {isLoading && (
        <div className="w-full px-2 flex justify-center gap-2">
          <Spinner size="small" />
          <span className="text-center">Loading exchange rates...</span>
        </div>
      )}
      {error && (
        <DestructiveAlert title="Error loading exchange rates">
          The exchange rates could not be loaded. Numbers may not be accurate.
          <br />
          {error}
        </DestructiveAlert>
      )}
      <div className="w-full md:w-3/6 px-2">
        <ChartExpenseByCategory />
      </div>
      <div className="w-full md:w-3/6 px-2">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountsBalance />
          </CardContent>
        </Card>
      </div>
      <div className="w-full px-2">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable />
          </CardContent>
        </Card>
      </div>
      <AddTransactionFloatingButton />
    </div>
  );
}
