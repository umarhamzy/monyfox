import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartFlowByMonth } from "@/components/chart-flow-by-month";
import { AccountsBalance } from "@/components/accounts-balance";
import { TransactionsTable } from "@/components/transactions-table";
import { NetWorthByMonth } from "@/components/chart-net-worth-by-month";

export const Route = createFileRoute("/p/$profileId/_profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-wrap -mx-2 gap-y-4">
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
    </div>
  );
}
