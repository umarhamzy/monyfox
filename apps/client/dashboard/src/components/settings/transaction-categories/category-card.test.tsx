import { TestContextProvider } from "@/utils/tests/contexts";
import { render, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import { TransactionCategoryCard } from "./category-card";
import { TransactionCategoryWithChildren } from "@/utils/transaction-category";

const mockCategory: TransactionCategoryWithChildren = {
  id: "1",
  name: "Test Category",
  parentTransactionCategoryId: null,
  children: [],
};

test("renders TransactionCategoryCard component", () => {
  const r = render(
    <TestContextProvider>
      <TransactionCategoryCard category={mockCategory} />
    </TestContextProvider>,
  );

  expect(r.getByText("Test Category")).toBeInTheDocument();
  expect(r.getByText("0 transactions")).toBeInTheDocument();
});

test("opens Edit Transaction Category modal", () => {
  const r = render(
    <TestContextProvider>
      <TransactionCategoryCard category={mockCategory} />
    </TestContextProvider>,
  );
  expect(r.queryByText("Edit the category.")).not.toBeInTheDocument();

  fireEvent.click(r.getByTitle("Edit"));
  expect(r.queryByText("Edit the category.")).toBeInTheDocument();
});
