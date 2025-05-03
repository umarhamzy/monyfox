import { TestContextProvider } from "@/utils/tests/contexts";
import { render, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TransactionCategoryFormModal } from "./category-form-modal";
import { type TransactionCategory } from "@monyfox/common-data";

test("open create modal", () => {
  const r = render(
    <TestContextProvider>
      <TransactionCategoryFormModal
        isOpen={true}
        onClose={() => {}}
        category={null}
      />
    </TestContextProvider>,
  );

  expect(r.getByText("Create a new category.")).toBeInTheDocument();
});

describe("open edit modal", () => {
  test("without parent", () => {
    const mockCategory: TransactionCategory = {
      id: "1",
      name: "Test Category",
      parentTransactionCategoryId: null,
    };

    const r = render(
      <TestContextProvider>
        <TransactionCategoryFormModal
          isOpen={true}
          onClose={() => {}}
          category={mockCategory}
        />
      </TestContextProvider>,
    );

    expect(r.getByText("Edit the category.")).toBeInTheDocument();

    expect(r.getAllByText("(None)")).toHaveLength(2); // option + selected
    expect(r.getAllByText("Category 1")).toHaveLength(1); // option
  });

  test("with parent", () => {
    const mockCategory: TransactionCategory = {
      id: "1",
      name: "Test Category",
      parentTransactionCategoryId: "CATEGORY_1",
    };

    const r = render(
      <TestContextProvider>
        <TransactionCategoryFormModal
          isOpen={true}
          onClose={() => {}}
          category={mockCategory}
        />
      </TestContextProvider>,
    );

    expect(r.getByText("Edit the category.")).toBeInTheDocument();

    expect(r.getAllByText("(None)")).toHaveLength(1); // option
    expect(r.getAllByText("Category 1")).toHaveLength(2); // option + selected
  });
});

test("cancel the form", () => {
  const onClose = vi.fn();

  const r = render(
    <TestContextProvider>
      <TransactionCategoryFormModal
        isOpen={true}
        onClose={onClose}
        category={null}
      />
    </TestContextProvider>,
  );

  fireEvent.click(r.getByText("Cancel"));

  expect(onClose).toHaveBeenCalled();
});
