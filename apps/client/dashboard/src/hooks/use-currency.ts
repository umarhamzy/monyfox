import { CurrencyClient } from "@/clients/currency";
import { useQuery } from "@tanstack/react-query";

export const useCurrency = () => {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: () => CurrencyClient.getCurrencies(),
  });
};
