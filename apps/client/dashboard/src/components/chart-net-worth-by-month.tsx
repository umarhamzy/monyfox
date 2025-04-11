import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { LocalDate, YearMonth } from "@js-joda/core";
import { useMemo } from "react";
import { useProfile } from "@/hooks/use-profile";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "#8884d8",
  },
} satisfies ChartConfig;

export function NetWorthByMonth() {
  const {
    data: { transactions },
    getAccount,
  } = useProfile();

  const startDate = LocalDate.now().minusMonths(12).withDayOfMonth(1);
  const endDate = LocalDate.now();

  const balances = useMemo(() => {
    const balanceByYearMonth = new Map<string, number>();

    // Ensure all months that we need to display are present in the map.
    for (
      let currentMonth = YearMonth.from(startDate);
      currentMonth.isBefore(YearMonth.from(endDate));
      currentMonth = currentMonth.plusMonths(1)
    ) {
      balanceByYearMonth.set(currentMonth.toString(), 0);
    }

    for (const transaction of transactions) {
      const yearMonth = YearMonth.from(
        LocalDate.parse(transaction.date),
      ).toString();

      const fromAccountId = transaction.from.accountId;
      const isFromPersonalAsset =
        fromAccountId !== null && getAccount(fromAccountId).isPersonalAsset;
      if (isFromPersonalAsset) {
        const amount = transaction.from.amount;
        balanceByYearMonth.set(
          yearMonth,
          (balanceByYearMonth.get(yearMonth) || 0) - amount,
        );
      }

      const toAccountId = transaction.to.accountId;
      const isToPersonalAsset =
        toAccountId !== null && getAccount(toAccountId).isPersonalAsset;
      if (isToPersonalAsset) {
        const amount = transaction.to.amount;
        balanceByYearMonth.set(
          yearMonth,
          (balanceByYearMonth.get(yearMonth) || 0) + amount,
        );
      }
    }

    const sortedEntries = Array.from(balanceByYearMonth.entries()).sort(
      ([a], [b]) => a.localeCompare(b),
    );

    const balances: { date: string; balance: number }[] = [];

    let cumulativeBalance = 0;
    for (const [yearMonthString, balance] of sortedEntries) {
      cumulativeBalance += balance;
      const yearMonth = YearMonth.parse(yearMonthString);

      if (yearMonth.isBefore(YearMonth.from(startDate))) {
        continue;
      }
      if (yearMonth.isAfter(YearMonth.from(endDate))) {
        break;
      }

      balances.push({
        date: yearMonth.toString(),
        balance: Math.round(cumulativeBalance)
      });
    }

    return balances;
  }, [getAccount, transactions]);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart accessibilityLayer data={balances}>
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
        <Line type="monotone" dataKey="balance" stroke="var(--color-balance)" />
      </LineChart>
    </ChartContainer>
  );
}
