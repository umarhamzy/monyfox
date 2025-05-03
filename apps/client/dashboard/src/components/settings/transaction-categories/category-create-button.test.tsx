import { TestContextProvider } from "@/utils/tests/contexts";
import { render, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import { CreateTransactionCategoryButton } from "./category-create-button";

test("renders CreateTransactionCategoryButton component", () => {
  const r = render(
    <TestContextProvider>
      <CreateTransactionCategoryButton />
    </TestContextProvider>,
  );

  expect(r.getByText("Create transaction category")).toBeInTheDocument();
});

test("opens TransactionCategoryFormModal when button is clicked", async () => {
  const r = render(
    <TestContextProvider>
      <CreateTransactionCategoryButton />
    </TestContextProvider>,
  );
  expect(r.queryByText("Create a new category.")).not.toBeInTheDocument();

  fireEvent.click(r.getByText("Create transaction category"));
  expect(r.queryByText("Create a new category.")).toBeInTheDocument();
});

test("closes TransactionCategoryFormModal when onClose is called", async () => {
  const r = render(
    <TestContextProvider>
      <CreateTransactionCategoryButton />
    </TestContextProvider>,
  );
  expect(r.queryByText("Create a new category.")).not.toBeInTheDocument();

  fireEvent.click(r.getByText("Create transaction category"));
  expect(r.queryByText("Create a new category.")).toBeInTheDocument();

  fireEvent.click(r.getByText("Cancel"));
  expect(r.queryByText("Create a new category.")).not.toBeInTheDocument();
});
