import { FiatCurrenciesCard } from "./fiat";
import { DefaultSymbolCard } from "./common";

export function SettingsSymbolsPage() {
  return (
    <div className="flex flex-col gap-4">
      <DefaultSymbolCard />
      <FiatCurrenciesCard />
    </div>
  );
}
