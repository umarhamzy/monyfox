import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";
import { LocalDate, YearMonth } from "@js-joda/core";
import { useMemo } from "react";
import { useProfile } from "@/hooks/use-profile";
import { getTransactionType, TransactionType } from "@/utils/transaction";

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
  const { getTransactionsBetweenDates, getAccount } = useProfile();

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
        LocalDate.parse(transaction.date),
      ).toString();

      if (!stateByDate.has(transactionDate)) {
        stateByDate.set(transactionDate, { income: 0, expense: 0 });
      }

      const state = stateByDate.get(transactionDate)!;
      // TODO: account for currency.
      if (isIncome) {
        state.income += transaction.to.amount;
      }
      if (isExpense) {
        state.expense += transaction.from.amount;
      }
      stateByDate.set(transactionDate, state);
    }

    const chartData: { date: string; income: number; expense: number }[] = [];
    for (
      let currentMonth = YearMonth.from(startDate);
      currentMonth.isBefore(YearMonth.from(endDate));
      currentMonth = currentMonth.plusMonths(1)
    ) {
      if (stateByDate.has(currentMonth.toString())) {
        chartData.push({
          date: currentMonth.toString(),
          ...stateByDate.get(currentMonth.toString())!,
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
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={incomeExpenseByMonthData}>
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
