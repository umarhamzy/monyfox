import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { LocalDate } from "@js-joda/core";
import { useMemo } from "react";
import { useProfile } from "@/hooks/use-profile";
import { getIncomeExpenseByMonthData } from "@/utils/transaction";
import { useSettings } from "@/hooks/use-settings";
import { useAssetSymbolExchangeRate } from "@/hooks/use-asset-symbol-exchange-rate";
import { yearMonthToLocalMonthYear } from "@/utils/datetime";

const chartConfig = {
  income: {
    label: "Income",
    color: "#22c55e",
  },
  expense: {
    label: "Expense",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export function ChartFlowByMonth() {
  const { defaultSymbolId } = useSettings();
  const { getTransactionsBetweenDates, getAccount } = useProfile();
  const { convertAmount } = useAssetSymbolExchangeRate();

  const startDate = LocalDate.now().minusMonths(12).withDayOfMonth(1);
  const endDate = LocalDate.now();
  const transactions = getTransactionsBetweenDates(startDate, endDate);

  const incomeExpenseByMonthData = useMemo(() => {
    return getIncomeExpenseByMonthData({
      transactions,
      startDate,
      endDate,
      getAccount,
      convertAmount,
      defaultSymbolId,
    });
  }, [
    transactions,
    startDate,
    endDate,
    getAccount,
    convertAmount,
    defaultSymbolId,
  ]);

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[300px] w-full"
      data-testid="flow-chart"
    >
      <BarChart accessibilityLayer data={incomeExpenseByMonthData}>
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) =>
            yearMonthToLocalMonthYear(value, startDate)
          }
        />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
