import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartFlowByMonth } from "@/components/chart-flow-by-month";
import { AccountsBalance } from "@/components/accounts-balance";
import { TransactionsTable } from "@/components/transaction/transactions-table";
import { NetWorthByMonth } from "@/components/chart-net-worth-by-month";
import { AddTransactionFloatingButton } from "@/components/transaction/transaction-form";
import { useAssetSymbolExchangeRate } from "@/hooks/use-asset-symbol-exchange-rate";
import { Spinner } from "@/components/ui/spinner";
import { DestructiveAlert } from "@/components/ui/alert";

export const Route = createFileRoute("/p/$profileId/_profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoading, error } = useAssetSymbolExchangeRate();

  return (
    <div className="flex flex-wrap -mx-2 gap-y-4 pb-12">
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
      <div className="md:w-4/6 w-full px-2">
        <Card>
          <CardHeader>
            <CardTitle>Last 12 months</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartFlowByMonth />
            <NetWorthByMonth />
          </CardContent>
        </Card>
      </div>
      <div className="w-full md:w-2/6 px-2">
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
