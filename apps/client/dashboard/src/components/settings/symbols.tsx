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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRightIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { ulid } from "ulid";
import { useCurrency } from "@/hooks/use-currency";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DefaultSymbolSelect } from "@/components/default-symbol-select";

export function SettingsSymbolsPage() {
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
          <FiatCurrencyExchanges />
        </CardContent>
      </Card>
    </div>
  );
}

export function SymbolsTypeTable({
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
            <TableCell className="text-right">
              <DeleteSymbolButton
                symbolId={symbol.id}
                transactionCountBySymbol={transactionCountBySymbol}
              />
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={4}>
            <AddCurrencyButton />
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
    <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete">
      <TrashIcon />
    </Button>
  );
}

function AddCurrencyButton() {
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

  function handleAddCurrency() {
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
          <SelectValue placeholder="Add a new currency" />
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
      <Button type="submit" onClick={handleAddCurrency} variant="secondary">
        Add
      </Button>
    </div>
  );
}

export function FiatCurrencyExchanges() {
  const {
    data: { assetSymbols, assetSymbolExchanges },
    getAssetSymbol,
  } = useProfile();

  useFiatCurrencyExchangeUpdate();

  if (assetSymbols.length <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Alert>
        <AlertTitle>Exchange rates</AlertTitle>
        <AlertDescription>
          Since you have multiple currencies, exchange rates are required to
          convert between them. They're added automatically when you add a new
          currency.
          <br />
          <div className="flex flex-wrap gap-2 mt-2">
            {assetSymbolExchanges.map((exchange) => (
              <Badge variant="outline" key={exchange.id}>
                {getAssetSymbol(exchange.fromAssetSymbolId).code}
                <ArrowRightIcon />
                {getAssetSymbol(exchange.toAssetSymbolId).code}
              </Badge>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function useFiatCurrencyExchangeUpdate() {
  const {
    data: { assetSymbols, assetSymbolExchanges },
    createAssetSymbolExchange: { mutate: createAssetSymbolExchange },
    deleteAssetSymbolExchange: { mutate: deleteAssetSymbolExchange },
  } = useProfile();

  const missingExchanges = useMemo(() => {
    const neededExchanges = new Set<string>();
    for (const from of assetSymbols) {
      for (const to of assetSymbols) {
        if (from.id !== to.id) {
          neededExchanges.add(`${from.id}-${to.id}`);
        }
      }
    }

    for (const exchange of assetSymbolExchanges) {
      neededExchanges.delete(
        `${exchange.fromAssetSymbolId}-${exchange.toAssetSymbolId}`,
      );
      neededExchanges.delete(
        `${exchange.toAssetSymbolId}-${exchange.fromAssetSymbolId}`,
      );
    }

    return Array.from(neededExchanges).map((exchange) => {
      const [fromId, toId] = exchange.split("-");
      return {
        from: assetSymbols.find((s) => s.id === fromId)!,
        to: assetSymbols.find((s) => s.id === toId)!,
      };
    });
  }, [assetSymbols, assetSymbolExchanges]);

  const existingSymbolIds = useMemo(
    () => new Set(assetSymbols.map((s) => s.id)),
    [assetSymbols],
  );
  const assetSymbolExchangesWithoutSymbols = useMemo(
    () =>
      assetSymbolExchanges.filter(
        (exchange) =>
          !existingSymbolIds.has(exchange.fromAssetSymbolId) ||
          !existingSymbolIds.has(exchange.toAssetSymbolId),
      ),
    [assetSymbolExchanges, existingSymbolIds],
  );

  useEffect(() => {
    if (missingExchanges.length > 0) {
      const exchange = missingExchanges[0];
      createAssetSymbolExchange({
        id: ulid(),
        fromAssetSymbolId: exchange.from.id,
        toAssetSymbolId: exchange.to.id,
        exchanger: {
          type: "frankfurter",
          base: exchange.from.code,
          target: exchange.to.code,
        },
      });
    }
  }, [missingExchanges, createAssetSymbolExchange]);

  useEffect(() => {
    if (assetSymbolExchangesWithoutSymbols.length > 0) {
      deleteAssetSymbolExchange(assetSymbolExchangesWithoutSymbols[0].id);
    }
  }, [assetSymbolExchangesWithoutSymbols, deleteAssetSymbolExchange]);
}
