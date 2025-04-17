import { TestContextProvider } from "@/utils/tests/contexts";
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { SettingsSymbolsPage } from "./page";

test("SettingsSymbolsPage", async () => {
  const { getByText } = render(
    <TestContextProvider>
      <SettingsSymbolsPage />
    </TestContextProvider>,
  );

  expect(getByText("Default currency")).toBeInTheDocument();
  expect(getByText("Fiat currencies")).toBeInTheDocument();
});
