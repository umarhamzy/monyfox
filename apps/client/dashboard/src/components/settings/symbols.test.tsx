import { TestContextProvider } from "@/utils/tests/contexts";
import { describe, expect, test } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import {
  FiatCurrencyExchanges,
  SettingsSymbolsPage,
  SymbolsTypeTable,
} from "./symbols";
import { useProfile } from "@/hooks/use-profile";

// https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
window.HTMLElement.prototype.scrollIntoView = function () {};

test("SettingsSymbolsPage", async () => {
  const { getByText } = render(
    <TestContextProvider>
      <SettingsSymbolsPage />
    </TestContextProvider>,
  );

  expect(getByText("Default currency")).toBeInTheDocument();
  expect(getByText("FIAT currencies")).toBeInTheDocument();
});

describe("create symbol", async () => {
  test("success", async () => {
    const transactionCountBySymbol = new Map<string, number>();
    transactionCountBySymbol.set("EUR", 2);
    transactionCountBySymbol.set("USD", 1);

    const { getByText, getAllByTitle, queryByText } = render(
      <TestContextProvider>
        <SymbolsTypeTable
          type="fiat"
          transactionCountBySymbol={transactionCountBySymbol}
        />
      </TestContextProvider>,
    );

    expect(getAllByTitle("Delete").length).toBe(2);
    expect(getByText("EUR")).toBeInTheDocument();
    expect(getByText("USD")).toBeInTheDocument();
    expect(queryByText("CAD")).toBeNull();

    fireEvent.click(getByText("Add a new currency"));
    await waitFor(() => getByText("CAD - Canadian Dollar"));
    fireEvent.click(getByText("CAD - Canadian Dollar"));
    fireEvent.click(getByText("Add"));

    await waitFor(() => expect(getAllByTitle("Delete").length).toBe(3));
    getByText("CAD");

    fireEvent.click(getAllByTitle("Delete")[2]);
    await waitFor(() => expect(queryByText("CAD")).toBeNull());
  });

  test("failure - no symbol selected", async () => {
    const transactionCountBySymbol = new Map<string, number>();
    transactionCountBySymbol.set("EUR", 2);
    transactionCountBySymbol.set("USD", 1);

    const { getByText, getAllByTitle, queryByText } = render(
      <TestContextProvider>
        <SymbolsTypeTable
          type="fiat"
          transactionCountBySymbol={transactionCountBySymbol}
        />
      </TestContextProvider>,
    );

    await waitFor(() => expect(getAllByTitle("Delete").length).toBe(2));
    expect(getByText("EUR")).toBeInTheDocument();
    expect(getByText("USD")).toBeInTheDocument();
    expect(queryByText("CAD")).toBeNull();

    fireEvent.click(getByText("Add"));

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(queryByText("CAD")).toBeNull();

    expect(getAllByTitle("Delete").length).toBe(2);
  });
});

describe("delete symbol", async () => {
  test("success", async () => {
    const transactionCountBySymbol = new Map<string, number>();
    transactionCountBySymbol.set("EUR", 2);
    transactionCountBySymbol.set("USD", 0);

    const { getByText, getAllByTitle, queryByText } = render(
      <TestContextProvider>
        <SymbolsTypeTable
          type="fiat"
          transactionCountBySymbol={transactionCountBySymbol}
        />
      </TestContextProvider>,
    );

    expect(getByText("EUR")).toBeInTheDocument();
    expect(getByText("USD")).toBeInTheDocument();

    fireEvent.click(getAllByTitle("Delete")[1]);
    await waitFor(() => expect(queryByText("USD")).toBeNull());
  });

  test("failure - symbol with transactions", async () => {
    const transactionCountBySymbol = new Map<string, number>();
    transactionCountBySymbol.set("EUR", 2);
    transactionCountBySymbol.set("USD", 1);

    const { getByText, getAllByTitle, queryByText } = render(
      <TestContextProvider>
        <SymbolsTypeTable
          type="fiat"
          transactionCountBySymbol={transactionCountBySymbol}
        />
      </TestContextProvider>,
    );

    expect(getByText("EUR")).toBeInTheDocument();
    expect(getByText("USD")).toBeInTheDocument();

    fireEvent.click(getAllByTitle("Delete")[1]);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(queryByText("USD")).toBeInTheDocument();
  });
});

describe("FiatCurrencyExchanges", () => {
  test("create missing exchanges", async () => {
    const { getByText, queryByText } = render(
      <TestContextProvider>
        <FiatCurrencyExchanges />
        <DeleteAssetSymbolButtonsForTest />
      </TestContextProvider>,
    );

    expect(getByText("Exchange rates")).toBeInTheDocument();

    // Initially, the exchange should not be present.
    expect(queryByText("EUR")).toBeNull();
    expect(queryByText("USD")).toBeNull();

    // Wait for the exchange to be created with useEffect.
    await waitFor(() => getByText(/EUR.*USD/));
  });

  test("delete exchanges when a currency is deleted", async () => {
    const { getByText, queryByText } = render(
      <TestContextProvider>
        <FiatCurrencyExchanges />
        <DeleteAssetSymbolButtonsForTest />
      </TestContextProvider>,
    );

    await waitFor(() => getByText(/EUR.*USD/));

    fireEvent.click(getByText("Delete EUR"));
    await waitFor(() => expect(queryByText(/EUR.*USD/)).toBeNull());
  });
});

function DeleteAssetSymbolButtonsForTest() {
  const {
    data: { assetSymbols },
    deleteAssetSymbol: { mutate: deleteAssetSymbol },
  } = useProfile();
  return (
    <>
      {assetSymbols.map((assetSymbol) => (
        <div key={assetSymbol.id}>
          <button onClick={() => deleteAssetSymbol(assetSymbol.id)}>
            Delete {assetSymbol.code}
          </button>
        </div>
      ))}
    </>
  );
}
