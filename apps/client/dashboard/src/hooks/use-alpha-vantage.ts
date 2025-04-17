import { z } from "zod";
import { useLocalStorage } from "./use-local-storage";
import { useProfile } from "./use-profile";

export function useAlphaVantage() {
  const { user } = useProfile();
  const alphaVantageKeyKey = `symbolExchange-alphaVantage-key-${user.id}`;

  const [alphaVantageKey, setAlphaVantageKey] = useLocalStorage(
    alphaVantageKeyKey,
    null,
    z.string().nullable(),
  );

  return {
    alphaVantageKey,
    setAlphaVantageKey,
  };
}
