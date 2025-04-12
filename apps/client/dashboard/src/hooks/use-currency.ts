import { FrankfurterCurrencyClient } from "@monyfox/common-symbol";
import { useQuery } from "@tanstack/react-query";

export const useCurrency = () => {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: () => FrankfurterCurrencyClient.getCurrencies(),
  });
};
