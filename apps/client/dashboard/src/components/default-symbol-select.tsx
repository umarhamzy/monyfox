import { useProfile } from "@/hooks/use-profile";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSettings } from "@/hooks/use-settings";
import { useMemo } from "react";
import { ASSET_SYMBOL_TYPES, type AssetSymbol } from "@monyfox/common-data";
import type { Key } from "react";

export function DefaultSymbolSelect() {
  const { defaultSymbolId, setDefaultSymbolId } = useSettings();
  const {
    data: { assetSymbols },
  } = useProfile();

  const currenciesByType = useMemo(() => {
    const result = new Map<keyof typeof ASSET_SYMBOL_TYPES, AssetSymbol[]>();

    assetSymbols.forEach((symbol: AssetSymbol) => {
      const curr = result.get(symbol.type);
      if (curr) {
        curr.push(symbol);
      } else {
        result.set(symbol.type, [symbol]);
      }
    });

    return Array.from(result.entries()).map(([type, symbols]: [keyof typeof ASSET_SYMBOL_TYPES, AssetSymbol[]]) => ({
      type,
      symbols: symbols.sort((a: AssetSymbol, b: AssetSymbol) =>
        a.displayName.localeCompare(b.displayName),
      ),
    }));
  }, [assetSymbols]);

  return (
    <Select value={defaultSymbolId} onValueChange={setDefaultSymbolId}>
      <SelectTrigger>
        <SelectValue placeholder="Default" />
      </SelectTrigger>
      <SelectContent className="h-96 overflow-y-auto">
        {currenciesByType.map(({ type, symbols }: { type: keyof typeof ASSET_SYMBOL_TYPES; symbols: AssetSymbol[] }) => (
          <SelectGroup key={type as Key}>
            <SelectLabel>{ASSET_SYMBOL_TYPES[type].label}</SelectLabel>
            {symbols.map((symbol: AssetSymbol) => (
              <SelectItem key={symbol.id} value={symbol.id}>
                {symbol.code}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}