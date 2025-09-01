import { describe, test, expect, beforeEach } from "vitest";
import { analyticsPlugin } from "./analytics";
import z from "zod";
import fs from "fs";
import path from "path";

describe("analyticsPlugin", () => {
  const mockDomain = "example.com";
  const scriptEndpoint = "https://plausible.example.com/js/script.js";

  let indexHtml: string;
  beforeEach(() => {
    indexHtml = fs.readFileSync(
      path.join(__dirname, "../../index.html"),
      "utf8",
    );
  });

  test("analytics script should be enabled", () => {
    indexHtml = indexHtml.replace("%VITE_PLAUSIBLE_DOMAIN%", mockDomain);
    indexHtml = indexHtml.replace("%VITE_PLAUSIBLE_SCRIPT%", scriptEndpoint);

    const plugin = z
      .object({
        name: z.string(),
        transformIndexHtml: z.function({
          input: [z.string()],
          output: z.string(),
        }),
      })
      .parse(analyticsPlugin());

    expect(plugin.name).toEqual("analytics");
    expect(plugin.transformIndexHtml(indexHtml)).toMatchInlineSnapshot(`
      "<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/png" href="/monyfox-logo.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>MonyFox</title>
          <script
            id="analytics"
            defer
            data-domain="example.com"
            src="https://plausible.example.com/js/script.js"
          ></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>
      "
    `);
  });

  test("analytics script should not be enabled with missing domain", () => {
    indexHtml = indexHtml.replace("%VITE_PLAUSIBLE_DOMAIN%", "");
    indexHtml = indexHtml.replace("%VITE_PLAUSIBLE_SCRIPT%", scriptEndpoint);

    const plugin = z
      .object({
        name: z.string(),
        transformIndexHtml: z.function({
          input: [z.string()],
          output: z.string(),
        }),
      })
      .parse(analyticsPlugin());

    expect(plugin.name).toEqual("analytics");
    expect(plugin.transformIndexHtml(indexHtml)).toMatchInlineSnapshot(`
      "<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/png" href="/monyfox-logo.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>MonyFox</title>
          
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>
      "
    `);
  });

  test("analytics script should not be enabled with missing script", () => {
    indexHtml = indexHtml.replace("%VITE_PLAUSIBLE_DOMAIN%", mockDomain);
    indexHtml = indexHtml.replace("%VITE_PLAUSIBLE_SCRIPT%", "");

    const plugin = z
      .object({
        name: z.string(),
        transformIndexHtml: z.function({
          input: [z.string()],
          output: z.string(),
        }),
      })
      .parse(analyticsPlugin());

    expect(plugin.name).toEqual("analytics");
    expect(plugin.transformIndexHtml(indexHtml)).toMatchInlineSnapshot(`
      "<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/png" href="/monyfox-logo.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>MonyFox</title>
          
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>
      "
    `);
  });

  test("analytics script should not be enabled with invalid script url", () => {
    indexHtml = indexHtml.replace("%VITE_PLAUSIBLE_DOMAIN%", mockDomain);
    indexHtml = indexHtml.replace("%VITE_PLAUSIBLE_SCRIPT%", "not-a-url");

    const plugin = z
      .object({
        name: z.string(),
        transformIndexHtml: z.function({
          input: [z.string()],
          output: z.string(),
        }),
      })
      .parse(analyticsPlugin());

    expect(plugin.name).toEqual("analytics");
    expect(plugin.transformIndexHtml(indexHtml)).toMatchInlineSnapshot(`
      "<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/png" href="/monyfox-logo.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>MonyFox</title>
          
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>
      "
    `);
  });
});
