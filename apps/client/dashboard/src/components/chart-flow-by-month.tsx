import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { LocalDate, YearMonth } from "@js-joda/core";
import { useMemo } from "react";
import { useProfile } from "@/hooks/use-profile";
import { getTransactionType, TransactionType } from "@/utils/transaction";
import { useSettings } from "@/hooks/use-settings";

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
  const { getTransactionsBetweenDates, getAccount, convertAmount } =
    useProfile();

  const startDate = LocalDate.now().minusMonths(12).withDayOfMonth(1);
  const endDate = LocalDate.now();
  const transactions = getTransactionsBetweenDates(startDate, endDate);

  const incomeExpenseByMonthData = useMemo(() => {
    const stateByDate = new Map<string, { income: number; expense: number }>();

    for (const transaction of transactions) {
      const transactionType = getTransactionType(transaction, getAccount);

      const isIncome = transactionType === TransactionType.Income;
      const isExpense = transactionType === TransactionType.Expense;

      if (!isIncome && !isExpense) {
        continue;
      }

      const transactionDate = YearMonth.from(
        LocalDate.parse(transaction.accountingDate),
      ).toString();

      if (!stateByDate.has(transactionDate)) {
        stateByDate.set(transactionDate, { income: 0, expense: 0 });
      }

      const state = stateByDate.get(transactionDate)!;
      if (isIncome) {
        state.income += convertAmount(
          transaction.to.amount,
          transaction.to.symbolId,
          defaultSymbolId,
        );
      }
      if (isExpense) {
        state.expense += convertAmount(
          transaction.from.amount,
          transaction.from.symbolId,
          defaultSymbolId,
        );
      }
      stateByDate.set(transactionDate, state);
    }

    const chartData: { date: string; income: number; expense: number }[] = [];
    for (
      let currentMonth = YearMonth.from(startDate);
      currentMonth.isBefore(YearMonth.from(endDate));
      currentMonth = currentMonth.plusMonths(1)
    ) {
      const state = stateByDate.get(currentMonth.toString());
      if (state !== undefined) {
        chartData.push({
          date: currentMonth.toString(),
          income: Math.round(state.income),
          expense: Math.round(state.expense),
        });
      } else {
        chartData.push({
          date: currentMonth.toString(),
          income: 0,
          expense: 0,
        });
      }
    }

    return chartData;
  }, [transactions, getAccount, startDate, endDate]);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={incomeExpenseByMonthData}>
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value}
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
