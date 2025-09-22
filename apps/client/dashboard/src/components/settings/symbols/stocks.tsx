import { useProfile } from "@/hooks/use-profile";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteSymbolButton } from "./common";
import { Modal, useModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  ExternalLinkIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAssetSymbolExchangeRate } from "@/hooks/use-asset-symbol-exchange-rate";
import { DestructiveAlert } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ulid } from "ulid";
import { Badge } from "@/components/ui/badge";
import { SearchStocksResult } from "@/contexts/asset-symbol-exchange-rate-context";
import { type AssetSymbol } from "@monyfox/common-data";

export function StocksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Stocks</span>
          <ConfigureAlphaVantageModalButton iconOnly />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StocksList />
      </CardContent>
    </Card>
  );
}

function StocksList() {
  const {
    data: { assetSymbols, assetSymbolExchangersMetadata },
  } = useProfile();

  const symbols = useMemo(
    () => assetSymbols.filter(({ type }: { type: string }) => type === "stock"),
    [assetSymbols],
  );

  if (assetSymbolExchangersMetadata.alphavantage === null) {
    return <ConfigureAlphaVantageModalButton />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {symbols.map((symbol) => (
          <StockCard key={symbol.code} symbol={symbol} />
        ))}
      </div>
      <div className="mt-4" />
      <AddStockButton />
    </>
  );
}

function StockCard({ symbol }: { symbol: AssetSymbol }) {
  const {
    data: { assetSymbolExchanges },
    getTransactionCountBySymbol,
    getAssetSymbol,
  } = useProfile();

  const symbolExchange = assetSymbolExchanges.find(
    (exchange) => exchange.fromAssetSymbolId === symbol.id,
  );

  return (
    <Card key={symbol.code}>
      <CardContent className="flex justify-between">
        <div>
          <CardTitle>{symbol.displayName}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-2 my-2">
              <Badge>{symbol.code}</Badge>
              {symbolExchange !== undefined ? (
                <Badge variant="outline">
                  {getAssetSymbol(symbolExchange.toAssetSymbolId).displayName}
                </Badge>
              ) : (
                <Badge variant="destructive">No exchange</Badge>
              )}
            </div>
            {getTransactionCountBySymbol(symbol.id)} transactions
          </CardDescription>
        </div>
        <DeleteSymbolButton symbolId={symbol.id} />
      </CardContent>
    </Card>
  );
}

function AddStockButton() {
  const { isOpen, openModal, closeModal } = useModal();
  const {
    data: { assetSymbols },
  } = useProfile();
  const { searchStocks } = useAssetSymbolExchangeRate();
  const [searchSymbol, setSearchSymbol] = useState("");

  const stocksCodes = useMemo(
    () =>
      new Set(
        assetSymbols
          .filter((s: AssetSymbol) => s.type === "stock")
          .map((stock: AssetSymbol) => stock.code),
      ),
    [assetSymbols],
  );

  const currencyByCode = useMemo(
    () => new Map(assetSymbols.map((s: AssetSymbol) => [s.code, s])),
    [assetSymbols],
  );

  const isLoading = searchStocks.isPending;
  return (
    <>
      <Button onClick={openModal} variant="outline">
        Add stock
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} title="Add stock">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a stock"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
          />
          <Button
            onClick={() => {
              searchStocks.mutate(searchSymbol);
            }}
            title="Search"
            isLoading={isLoading}
            hideChildren={isLoading}
          >
            <SearchIcon />
          </Button>
        </div>
        <div className="mt-4">
          <ScrollArea className="h-96 max-h-full">
            {searchStocks.error && (
              <DestructiveAlert title="Error">
                {searchStocks.error.message}
              </DestructiveAlert>
            )}
            {searchStocks.isSuccess && searchStocks.data.length === 0 && (
              <DestructiveAlert title="No stocks found">
                No stocks found for the given search term.
              </DestructiveAlert>
            )}
            <div className="flex flex-col gap-4">
              {searchStocks.data?.map((stock: SearchStocksResult[number]) => (
                <StockSymbolItem
                  key={stock.code}
                  stock={stock}
                  stocksCodes={stocksCodes}
                  currencyByCode={currencyByCode}
                  onSuccess={() => {
                    setSearchSymbol("");
                    closeModal();
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

function StockSymbolItem({
  stock,
  stocksCodes,
  currencyByCode,
  onSuccess,
}: {
  stock: SearchStocksResult[number];
  stocksCodes: Set<string>;
  currencyByCode: Map<string, AssetSymbol>;
  onSuccess: () => void;
}) {
  const { createAssetSymbolWithExchange } = useProfile();

  const alreadyExists = stocksCodes.has(stock.code);

  const currency = currencyByCode.get(stock.currency);
  const hasCurrency = currency !== undefined;

  function handleAddSymbol() {
    if (!hasCurrency || alreadyExists) {
      // This should never happen because the button is disabled
      return;
    }

    const symbolId = ulid();
    const symbolExchangeId = ulid();

    createAssetSymbolWithExchange.mutate(
      {
        assetSymbol: {
          id: symbolId,
          code: stock.code,
          displayName: stock.displayName,
          type: "stock",
        },
        assetSymbolExchange: {
          id: symbolExchangeId,
          fromAssetSymbolId: symbolId,
          toAssetSymbolId: currency.id,
          exchanger: {
            type: "alphavantage-stock",
            symbol: stock.code,
          },
        },
      },
      { onSuccess },
    );
  }

  return (
    <Card>
      <CardContent className="flex justify-between">
        <div>
          <CardTitle>{stock.code}</CardTitle>
          <CardDescription>
            {stock.displayName}
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{stock.type}</Badge>
              <Badge variant="outline">{stock.region}</Badge>
              <Badge variant={hasCurrency ? "outline" : "destructive"}>
                {stock.currency}
              </Badge>
              <Badge variant="outline">
                {stock.marketOpen} - {stock.marketClose} {stock.timezone}
              </Badge>
            </div>
            {!hasCurrency && (
              <>
                <div className="mt-2" />
                <DestructiveAlert title="No currency found">
                  The currency {stock.currency} is not configured. Please add it
                  first.
                </DestructiveAlert>
              </>
            )}
          </CardDescription>
        </div>
        <Button
          onClick={handleAddSymbol}
          title={`Add ${stock.code}`}
          disabled={alreadyExists || !hasCurrency}
        >
          {alreadyExists ? <CheckIcon /> : <PlusIcon />}
        </Button>
      </CardContent>
    </Card>
  );
}

function ConfigureAlphaVantageModalButton({
  iconOnly,
}: {
  iconOnly?: boolean;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const {
    data: {
      assetSymbolExchangersMetadata: { alphavantage },
    },
    updateAlphaVantageApiKey,
  } = useProfile();
  const [apiKey, setApiKey] = useState(
    alphavantage !== null ? alphavantage.apiKey : "",
  );

  return (
    <>
      {iconOnly ? (
        <Button onClick={openModal} variant="outline" title="Configure stocks">
          <SettingsIcon />
        </Button>
      ) : (
        <Button onClick={openModal}>Configure stocks</Button>
      )}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Configure stocks prices"
      >
        To retrieve stock prices, you need to configure an Alpha Vantage API
        key.
        <br />
        <br />
        <b>Step 1</b>
        Click the button below to go to the Alpha Vantage website and sign up
        for a free API key.
        <br />
        <a
          href="https://www.alphavantage.co/support/#api-key"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="w-full">
            Go to Alpha Vantage <ExternalLinkIcon />
          </Button>
        </a>
        <br />
        <b>Step 2</b>
        Copy the API key from the Alpha Vantage website and paste it into the
        input field below.
        <br />
        <Input
          type="password"
          placeholder="Alpha Vantage API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-2"
        />
        <br />
        <b>Step 3</b>
        Click the button below to save the API key.
        <div className="flex justify-between gap-2 mt-4">
          <Button
            variant="outline"
            title="Delete API key"
            onClick={() => {
              setApiKey("");
              updateAlphaVantageApiKey.mutate(null);
              closeModal();
            }}
          >
            <TrashIcon />
          </Button>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateAlphaVantageApiKey.mutate(apiKey);
                closeModal();
              }}
            >
              Save API key
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
