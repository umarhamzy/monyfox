import { z } from "zod";
import { useLocalStorage } from "./use-local-storage";
import { getAnalyticsConfig } from "@/utils/analytics";

export function useAnalytics() {
  const config = getAnalyticsConfig();

  // https://plausible.io/docs/excluding-localstorage
  const [plausibleIgnore, setPlausibleIgnore] = useLocalStorage(
    "plausible_ignore",
    "false",
    z.union([z.literal("true"), z.literal("false")]),
  );

  const toggleTracking = () =>
    setPlausibleIgnore(plausibleIgnore === "true" ? "false" : "true");

  return {
    isConfigured: config.isConfigured,
    isTracking: plausibleIgnore !== "true",
    toggleTracking,
  };
}
