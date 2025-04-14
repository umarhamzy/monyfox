import { TestContextProvider } from "@/utils/tests/contexts";
import { expect, test } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { SettingsSymbolsPage, SymbolsTypeTable } from "./symbols";

test("SettingsSymbolsPage", async () => {
  const { getByText } = render(
    <TestContextProvider>
      <SettingsSymbolsPage />
    </TestContextProvider>,
  );

  expect(getByText("Default currency")).toBeInTheDocument();
  expect(getByText("FIAT currencies")).toBeInTheDocument();
});

test("SymbolsTypeTable", async () => {
  // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
  window.HTMLElement.prototype.scrollIntoView = function () {};

  const transactionCountBySymbol = new Map<string, number>();
  transactionCountBySymbol.set("USD", 1);
  transactionCountBySymbol.set("EUR", 2);

  const { getByText } = render(
    <TestContextProvider>
      <SymbolsTypeTable
        type="fiat"
        transactionCountBySymbol={transactionCountBySymbol}
      />
    </TestContextProvider>,
  );

  expect(getByText("EUR")).toBeInTheDocument();
  expect(getByText("USD")).toBeInTheDocument();

  fireEvent.click(getByText("Add a new currency"));
  await waitFor(() => getByText("CAD - Canadian Dollar"));
  fireEvent.click(getByText("CAD - Canadian Dollar"));
  fireEvent.click(getByText("Add"));

  // TODO: figure out why this is failing
  // await waitFor(() => getByText("CAD"));
});
