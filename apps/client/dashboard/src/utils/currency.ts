import { type AssetSymbol } from "@monyfox/common-data";

const userLocale = "language" in navigator ? navigator.language : "en-GB";

export function formatCurrency(
  amount: number,
  symbol: AssetSymbol,
  locale: string = userLocale,
) {
  try {
    if (symbol.type === "fiat") {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: symbol.code,
      }).format(amount);
    }
  } catch (e) {
    // Fails if the symbol is not a fiat currency in Intl.NumberFormat.
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${symbol.code}`;
}
