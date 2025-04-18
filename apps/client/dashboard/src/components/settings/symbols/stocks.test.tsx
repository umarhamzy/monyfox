import { TestContextProvider } from "@/utils/tests/contexts";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { expect, test } from "vitest";
import { StocksCard } from "./stocks";

test("renders StocksCard component", () => {
  const r = render(
    <TestContextProvider>
      <StocksCard />
    </TestContextProvider>,
  );

  expect(r.getByText("Stocks")).toBeInTheDocument();
});

test("opens Add Stock modal", () => {
  const r = render(
    <TestContextProvider>
      <StocksCard />
    </TestContextProvider>,
  );

  fireEvent.click(r.getByText("Add stock", { selector: "button" }));

  expect(r.getByText("Add stock", { selector: "h2" })).toBeInTheDocument();
});

test("configure Alpha Vantage and search with wrong key", async () => {
  const r = render(
    <TestContextProvider withStocks={false}>
      <StocksCard />
    </TestContextProvider>,
  );

  expect(r.queryByText("Add stock")).toBeNull();

  fireEvent.click(r.getByText("Configure stocks"));
  await waitFor(() => {
    expect(r.getByText("Configure stocks prices")).toBeInTheDocument();
  });

  fireEvent.input(r.getByPlaceholderText("Alpha Vantage API key"), {
    target: { value: "WRONG_API_KEY" },
  });

  fireEvent.click(r.getByText("Save API key"));

  await waitFor(() => {
    expect(r.getByText("Add stock")).toBeInTheDocument();
  });

  // Open add stock modal
  fireEvent.click(r.getByText("Add stock", { selector: "button" }));
  const searchInput = r.getByPlaceholderText("Search for a stock");
  fireEvent.change(searchInput, { target: { value: "WLD" } });
  fireEvent.click(r.getByTitle("Search"));
  await waitFor(() => {
    expect(r.getByText("The api key is invalid.")).toBeInTheDocument();
  });
});

test("delete Alpha Vantage API key", async () => {
  const r = render(
    <TestContextProvider>
      <StocksCard />
    </TestContextProvider>,
  );
  fireEvent.click(r.getByTitle("Configure stocks"));
  await waitFor(() => {
    expect(r.getByText("Configure stocks prices")).toBeInTheDocument();
  });
  fireEvent.click(r.getByTitle("Delete API key"));
  await waitFor(() => {
    expect(r.queryByText("Configure stocks prices")).toBeNull();
  });
});

test("search for a non existing stock", async () => {
  const r = render(
    <TestContextProvider>
      <StocksCard />
    </TestContextProvider>,
  );

  fireEvent.click(r.getByText("Add stock"));

  expect(r.queryByText("NON_EXISTING")).toBeNull();

  const searchInput = r.getByPlaceholderText("Search for a stock");
  fireEvent.change(searchInput, { target: { value: "NON_EXISTING" } });
  fireEvent.click(r.getByTitle("Search"));

  await waitFor(() => {
    expect(
      r.getByText("No stocks found for the given search term."),
    ).toBeInTheDocument();
  });
});

test("add a stock", async () => {
  const r = render(
    <TestContextProvider>
      <StocksCard />
    </TestContextProvider>,
  );

  fireEvent.click(r.getByText("Add stock"));

  expect(r.queryByText("WLD")).toBeNull();

  const searchInput = r.getByPlaceholderText("Search for a stock");
  fireEvent.change(searchInput, { target: { value: "WLD" } });
  fireEvent.click(r.getByTitle("Search"));

  await waitFor(() => {
    expect(r.getByText("WLD")).toBeInTheDocument();
  });

  fireEvent.click(r.getByTitle("Add WLD"));

  await waitFor(() => {
    expect(r.queryByText("Search")).toBeNull();
  });

  expect(r.getByText("WLD")).toBeInTheDocument();
});

test("can't add a stock twice", async () => {
  const r = render(
    <TestContextProvider>
      <StocksCard />
    </TestContextProvider>,
  );

  fireEvent.click(r.getByText("Add stock"));

  const searchInput = r.getByPlaceholderText("Search for a stock");
  fireEvent.change(searchInput, { target: { value: "MWRD" } });
  fireEvent.click(r.getByTitle("Search"));

  await waitFor(() => {
    expect(r.getByText("MWRD name")).toBeInTheDocument();
  });

  expect(r.getByTitle("Add MWRD")).toBeDisabled();
});

test("can't add a stock without its currency", async () => {
  const r = render(
    <TestContextProvider withFiat={false}>
      <StocksCard />
    </TestContextProvider>,
  );

  fireEvent.click(r.getByText("Add stock"));

  const searchInput = r.getByPlaceholderText("Search for a stock");
  fireEvent.change(searchInput, { target: { value: "MWRD" } });
  fireEvent.click(r.getByTitle("Search"));

  await waitFor(() => {
    expect(r.getByText("MWRD name")).toBeInTheDocument();
  });

  expect(
    r.getAllByText("The currency EUR is not configured. Please add it first.")
      .length,
  ).toBe(2);
  expect(r.getByTitle("Add MWRD")).toBeDisabled();
});
