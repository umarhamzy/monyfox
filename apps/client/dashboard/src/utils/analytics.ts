import type { PluginOption } from "vite";
import { z } from "zod";

export function getAnalyticsConfig({
  domain,
  scriptUrl,
}: {
  domain: unknown;
  scriptUrl: unknown;
}) {
  const plausibleDomain = z.string().min(1).safeParse(domain);
  const plausibleScript = z.url().safeParse(scriptUrl);

  if (plausibleDomain.success && plausibleScript.success) {
    return {
      isConfigured: true as const,
      domain: plausibleDomain.data,
      scriptUrl: plausibleScript.data,
    };
  }

  return {
    isConfigured: false as const,
  };
}

export function analyticsPlugin(): PluginOption {
  return {
    name: "analytics",
    transformIndexHtml(html) {
      // Environment variables are not available here, having them into the
      // index.html file and parsing them from here is a workaround
      let script = "";

      const regex =
        /<script[\s\S]*?id="analytics"[\s\S]*?data-domain="([^"]*)"[\s\S]*?src="([^"]*)"[\s\S]*?>[\s\S]*?<\/script>/;
      const match = html.match(regex);

      if (match) {
        const config = getAnalyticsConfig({
          domain: match[1],
          scriptUrl: match[2],
        });

        if (config.isConfigured) {
          script = match[0]
            .replace(/data-domain="[^"]*"/, `data-domain="${config.domain}"`)
            .replace(/src="[^"]*"/, `src="${config.scriptUrl}"`);
        }
      }

      return html.replace(regex, script);
    },
  };
}
