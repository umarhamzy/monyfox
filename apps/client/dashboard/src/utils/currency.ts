import { type AssetSymbol } from "@monyfox/common-data";

function getUserLocale(locale?: string) {
  if (locale) {
    return locale;
  }

  return "language" in navigator ? navigator.language : "en-GB";
}

export function formatCurrency(
  amount: number,
  symbol: AssetSymbol,
  locale?: string,
) {
  const userLocale = getUserLocale(locale);

  try {
    if (symbol.type === "fiat") {
      return new Intl.NumberFormat(userLocale, {
        style: "currency",
        currency: symbol.code,
      }).format(amount);
    }
  } catch (e) {
    // Fails if the symbol is not a fiat currency in Intl.NumberFormat.
  }

  const formatted = new Intl.NumberFormat(userLocale, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${symbol.code}`;
}
