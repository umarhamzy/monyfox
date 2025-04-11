import { useProfile } from "@/hooks/use-profile";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSettings } from "@/hooks/use-settings";

export function DefaultSymbolSelect() {
  const { defaultSymbolId, setDefaultSymbolId } = useSettings();
  const {
    data: { assetSymbols },
  } = useProfile();

  return (
    <Select value={defaultSymbolId} onValueChange={setDefaultSymbolId}>
      <SelectTrigger>
        <SelectValue placeholder="Default" />
      </SelectTrigger>
      <SelectContent className="h-96 overflow-y-auto">
        <SelectGroup>
          {assetSymbols.map((symbol) => (
            <SelectItem key={symbol.id} value={symbol.id}>
              {symbol.displayName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
