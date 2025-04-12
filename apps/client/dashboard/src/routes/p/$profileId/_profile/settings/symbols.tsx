import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProfile } from "@/hooks/use-profile";
import { AssetSymbol } from "@monyfox/common-data";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ulid } from "ulid";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DefaultSymbolSelect } from "@/components/default-symbol-select";

export const Route = createFileRoute("/p/$profileId/_profile/settings/symbols")(
  {
    component: RouteComponent,
  },
);
function RouteComponent() {
  const {
    data: { transactions },
  } = useProfile();

  const transactionCountBySymbol = useMemo(() => {
    const map = new Map<string, number>();
    for (const transaction of transactions) {
      const fromSymbol = transaction.from.symbolId;
      const toSymbol = transaction.to.symbolId;

      if (fromSymbol === toSymbol) {
        map.set(fromSymbol, (map.get(fromSymbol) ?? 0) + 1);
      } else {
        map.set(fromSymbol, (map.get(fromSymbol) ?? 0) + 1);
        map.set(toSymbol, (map.get(toSymbol) ?? 0) + 1);
      }
    }
    return map;
  }, [transactions]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Default currency</CardTitle>
        </CardHeader>
        <CardContent>
          While transactions are shown in their original currency, account
          balances are summed up to a single currency. You can use select the
          default currency to use here.
          <br />
          Note: for this to work properly, you need to set up the exchange rates
          correctly. If an exchange rate is missing, a 1x conversion rate will
          be used.
        </CardContent>
        <CardFooter>
          <DefaultSymbolSelect />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>FIAT currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <SymbolsTypeTable
            type="fiat"
            transactionCountBySymbol={transactionCountBySymbol}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SymbolsTypeTable({
  type,
  transactionCountBySymbol,
}: {
  type: AssetSymbol["type"];
  transactionCountBySymbol: Map<string, number>;
}) {
  const {
    data: { assetSymbols },
  } = useProfile();

  const symbols = assetSymbols.filter((symbol) => symbol.type === type);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Transactions</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {symbols.map((symbol) => (
          <TableRow key={symbol.code}>
            <TableCell>{symbol.code}</TableCell>
            <TableCell>
              {transactionCountBySymbol.get(symbol.id) ?? 0}
            </TableCell>
            <TableCell>
              <DeleteSymbolButton
                symbolId={symbol.id}
                transactionCountBySymbol={transactionCountBySymbol}
              />
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={4}>
            <AddCurrencyModalButton />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function DeleteSymbolButton({
  symbolId,
  transactionCountBySymbol,
}: {
  symbolId: string;
  transactionCountBySymbol: Map<string, number>;
}) {
  const { deleteAssetSymbol } = useProfile();

  function handleDelete() {
    if (transactionCountBySymbol.get(symbolId) ?? 0 > 0) {
      toast.error("Cannot delete symbol with transactions");
      return;
    }

    deleteAssetSymbol.mutate(symbolId);
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <TrashIcon />
    </Button>
  );
}

function AddCurrencyModalButton() {
  const {
    createAssetSymbol,
    data: { assetSymbols },
  } = useProfile();
  const currenciesQuery = useCurrency();

  const existingCurrencies = new Set(
    assetSymbols
      .filter((symbol) => symbol.type === "fiat")
      .map((symbol) => symbol.code),
  );
  const remainingCurrencies =
    currenciesQuery.data?.filter(
      (currency) => !existingCurrencies.has(currency.code),
    ) ?? [];

  const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(
    undefined,
  );
  function handleAdd() {
    if (!selectedCurrency) {
      toast.error("Please select a currency");
      return;
    }
    createAssetSymbol.mutate(
      {
        id: ulid(),
        code: selectedCurrency,
        displayName: selectedCurrency,
        type: "fiat",
      },
      {
        onSuccess: () => {
          const nextCurrency = remainingCurrencies?.find(
            (currency) => currency.code !== selectedCurrency,
          );
          setSelectedCurrency(nextCurrency?.code);
        },
      },
    );
  }

  if (currenciesQuery.isError) {
    toast.error("Failed to load currencies", {
      description: currenciesQuery.error.message,
    });
    return null;
  }

  return (
    <div className="flex gap-2">
      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
        <SelectTrigger>
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent className="h-96 overflow-y-auto">
          <SelectGroup>
            {remainingCurrencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit" onClick={handleAdd} variant="secondary">
        Add
      </Button>
    </div>
  );
}
