import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartFlowByMonth } from "@/components/chart-flow-by-month";

export const Route = createFileRoute("/p/$profileId/_profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card className="lg:w-4/6 md:w-4/6 w-full">
      <CardHeader>
        <CardTitle>Last 12 months</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartFlowByMonth />
      </CardContent>
    </Card>
  );
}
