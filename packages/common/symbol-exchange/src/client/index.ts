export type GetExchangeRateRequest = {
  /**
   * The symbol of the currency to convert from.
   */
  from: string;
  /**
   * The symbol of the currency to convert to.
   */
  to: string;
  /**
   * The first date of the range to get the exchange rate for.
   * Format: YYYY-MM-DD.
   */
  startDate: string;
  /**
   * The last date of the range to get the exchange rate for.
   * Format: YYYY-MM-DD.
   */
  endDate: string;
};

export type GetExchangeRateResponse = Array<{
  /**
   * The date of the exchange rate.
   * Format: YYYY-MM-DD.
   */
  date: string;
  /**
   * The exchange rate.
   */
  rate: number;
}>;

export interface SymbolExchangeClient {
  /**
   * Get the exchange rates for a given symbol pair and date range.
   * The response is an array of exchange rates, one for each existing date in the
   * range. Some dates may be missing if the exchange rate is not available for
   * that date.
   */
  getExchangeRates: (
    params: GetExchangeRateRequest,
  ) => Promise<GetExchangeRateResponse>;
}
