import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartFlowByMonth } from "@/components/chart-flow-by-month";
import { AccountsBalance } from "@/components/accounts-balance";

export const Route = createFileRoute("/p/$profileId/_profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex gap-4">
      <Card className="md:w-4/6 w-full">
        <CardHeader>
          <CardTitle>Last 12 months</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartFlowByMonth />
        </CardContent>
      </Card>
      <Card className="md:w-2/6 w-full">
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountsBalance />
        </CardContent>
      </Card>
    </div>
  );
}
