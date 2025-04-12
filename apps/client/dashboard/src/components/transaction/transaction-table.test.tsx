import { TestContextProvider } from "@/utils/tests/contexts";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { TransactionsTable } from "./transactions-table";
import { render } from "@testing-library/react";

const originalLanguageDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  "language",
);

beforeEach(() => {
  Object.defineProperty(navigator, "language", {
    value: "it-IT",
    configurable: true,
  });
});

afterEach(() => {
  if (originalLanguageDescriptor) {
    Object.defineProperty(navigator, "language", originalLanguageDescriptor);
  }
});

describe("TransactionsTable", () => {
  test("set default symbol", async () => {
    const { getByText } = render(
      <TestContextProvider>
        <TransactionsTable />
      </TestContextProvider>,
    );

    expect(getByText("Expense")).toBeInTheDocument();
    expect(getByText("(23,00 €)")).toBeInTheDocument();

    expect(getByText("Income")).toBeInTheDocument();
    expect(getByText("950,00 €")).toBeInTheDocument();
  });
});
