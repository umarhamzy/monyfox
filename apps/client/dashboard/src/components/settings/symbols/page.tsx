import { FiatCurrenciesCard } from "./fiat";
import { DefaultSymbolCard } from "./common";
import { StocksCard } from "./stocks";

export function SettingsSymbolsPage() {
  return (
    <div className="flex flex-col gap-4">
      <DefaultSymbolCard />
      <FiatCurrenciesCard />
      <StocksCard />
    </div>
  );
}
