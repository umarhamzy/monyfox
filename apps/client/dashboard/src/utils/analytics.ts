import { init } from "@plausible-analytics/tracker/plausible.js";
import { z } from "zod";

export function getAnalyticsConfig() {
  const plausibleDomain = z
    .string()
    .url()
    .safeParse(import.meta.env.VITE_PLAUSIBLE_DOMAIN);

  if (plausibleDomain.success) {
    return {
      isConfigured: true as const,
      domain: plausibleDomain.data,
    };
  }

  return {
    isConfigured: false as const,
  };
}

export function initializeAnalytics() {
  const config = getAnalyticsConfig();

  if (config.isConfigured) {
    init({
      domain: config.domain,
    });
  }
}
