import { LabelList, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSettings } from "@/hooks/use-settings";
import { useProfile } from "@/hooks/use-profile";
import { useAssetSymbolExchangeRate } from "@/hooks/use-asset-symbol-exchange-rate";
import { LocalDate } from "@js-joda/core";
import { useMemo } from "react";
import { getIncomeExpenseByCategoryData } from "@/utils/transaction";

export function ChartExpenseByCategory() {
  const { defaultSymbolId } = useSettings();
  const {
    data: { transactionCategories },
    getTransactionsBetweenDates,
    getAccount,
    getTransactionCategory,
  } = useProfile();
  const { convertAmount } = useAssetSymbolExchangeRate();

  const startDate = LocalDate.now().withDayOfMonth(1);
  const endDate = LocalDate.now();
  const transactions = getTransactionsBetweenDates(startDate, endDate);

  const expenseByCategoryData = useMemo(() => {
    return getIncomeExpenseByCategoryData({
      transactions,
      getAccount,
      convertAmount,
      defaultSymbolId,
    })
      .map((data) => ({
        ...data,
        categoryName:
          getTransactionCategory(data.categoryId)?.name || "Uncategorized",
      }))
      .sort((a, b) => a.expense - b.expense)
      .filter((data) => data.expense > 0);
  }, [
    transactions,
    getAccount,
    convertAmount,
    defaultSymbolId,
    getTransactionCategory,
  ]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = { "-": { label: "Uncategorized" } };
    for (const category of transactionCategories) {
      config[category.id] = {
        label: category.name,
      };
    }
    return config;
  }, [transactionCategories]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expenses</CardTitle>
        <CardDescription>This month so far.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={expenseByCategoryData}
            startAngle={180}
            endAngle={-180}
            innerRadius={30}
            outerRadius="100%" 
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="categoryId" />}
            />
            <RadialBar dataKey="expense" background cornerRadius={10}>
              <LabelList
                position="insideStart"
                dataKey="categoryName"
                style={{
                  filter: "invert(1)",
                  mixBlendMode: "difference",
                }}
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
