import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { LocalDate } from "@js-joda/core";
import { useMemo } from "react";
import { useProfile } from "@/hooks/use-profile";
import { getBalancesByMonth } from "@/utils/transaction";
import { useAssetSymbolExchangeRate } from "@/hooks/use-asset-symbol-exchange-rate";
import { useSettings } from "@/hooks/use-settings";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "#8884d8",
  },
} satisfies ChartConfig;

export function NetWorthByMonth() {
  const { defaultSymbolId } = useSettings();
  const {
    data: { transactions },
    getAccount,
  } = useProfile();
  const { convertAmount } = useAssetSymbolExchangeRate();

  const startDate = LocalDate.now().minusMonths(12).withDayOfMonth(1);
  const endDate = LocalDate.now();

  const balances = useMemo(() => {
    return getBalancesByMonth({
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
