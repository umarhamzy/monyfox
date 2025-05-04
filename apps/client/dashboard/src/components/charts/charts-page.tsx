import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartFlowByMonth } from "./chart-flow-by-month";
import { NetWorthByMonth } from "./chart-net-worth-by-month";

export function ChartsPage() {
  return (
    <Tabs defaultValue="flow">
      <TabsList>
        <TabsTrigger value="flow">Flow</TabsTrigger>
        <TabsTrigger value="net-worth">Net worth</TabsTrigger>
      </TabsList>
      <Card>
        <CardContent>
          <TabsContent value="flow">
            <ChartFlowByMonth />
          </TabsContent>
          <TabsContent value="net-worth">
            <NetWorthByMonth />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
