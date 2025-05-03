import { TestContextProvider } from "@/utils/tests/contexts";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TransactionCategoriesList } from "./categories-list";
import { toast } from "sonner";

test("renders TransactionCategoriesPage component", () => {
  const r = render(
    <TestContextProvider>
      <TransactionCategoriesList />
    </TestContextProvider>,
  );

  expect(r.getByText("Category 1")).toBeInTheDocument();
  expect(r.getByText("Subcategory 1-1")).toBeInTheDocument();
});

describe("create transaction category", async () => {
  test("success", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const r = render(
      <TestContextProvider>
        <TransactionCategoriesList />
      </TestContextProvider>,
    );
    const createButton = r.getByText("Create transaction category");
    fireEvent.click(createButton);

    expect(r.getByText("Create a new category.")).toBeInTheDocument();

    expect(r.queryByText("New category")).toBeNull();

    const nameInput = r.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "New category" } });

    expect(r.queryByText("New category")).toBeNull();

    fireEvent.click(r.getByText("Create"));

    await waitFor(() => {
      expect(r.getByText("New category")).toBeInTheDocument();
    });

    expect(toastSuccess).toHaveBeenCalledWith("Category saved");
    expect(toastError).not.toHaveBeenCalled();
  });
});

describe("update transaction category", async () => {
  test("success", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const r = render(
      <TestContextProvider>
        <TransactionCategoriesList />
      </TestContextProvider>,
    );
    const editButton = r.getAllByTitle("Edit");
    expect(editButton).toHaveLength(2);
    fireEvent.click(editButton[0]);

    expect(r.getByText("Edit the category.")).toBeInTheDocument();

    expect(r.queryByText("New category name")).toBeNull();

    const nameInput = r.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "New category name" } });

    expect(r.queryByText("New category name")).toBeNull();

    fireEvent.click(r.getByText("Save"));

    await waitFor(() => {
      expect(r.getByText("New category name")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith("Category saved");
      expect(toastError).not.toHaveBeenCalled();
    });
  });

  test("error - cycle", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const r = render(
      <TestContextProvider>
        <TransactionCategoriesList />
      </TestContextProvider>,
    );
    const editButton = r.getAllByTitle("Edit");
    expect(editButton).toHaveLength(2);
    fireEvent.click(editButton[0]);
    expect(r.getByText("Edit the category.")).toBeInTheDocument();

    // Check that we're editing "Category 1"
    expect(r.getByLabelText("Name")).toHaveValue("Category 1");

    // Assign "Subcategory 1-1" as parent of "Category 1", creating a cycle
    fireEvent.click(r.getByRole("combobox"));
    fireEvent.click(r.getByText("- Subcategory 1-1", { selector: "span" }));

    fireEvent.click(r.getByText("Save"));

    await waitFor(() => {
      expect(toastSuccess).not.toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith("Error saving category", {
        description: "There are cycles in the transaction categories.",
      });
    });
  });
});

describe("delete transaction category", async () => {
  test("success", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const r = render(
      <TestContextProvider>
        <TransactionCategoriesList />
      </TestContextProvider>,
    );

    const deleteButton = r.getAllByTitle("Delete");
    expect(deleteButton).toHaveLength(2);
    fireEvent.click(deleteButton[1]);

    expect(r.getByText("Delete transaction category")).toBeInTheDocument();
    fireEvent.click(r.getByText("Delete"));

    await waitFor(() => {
      expect(r.queryByText("Category 2")).toBeNull();
    });

    expect(toastSuccess).toHaveBeenCalledWith("Category deleted");
    expect(toastError).not.toHaveBeenCalled();
  });

  test("error - category with subcategories", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const r = render(
      <TestContextProvider>
        <TransactionCategoriesList />
      </TestContextProvider>,
    );

    const deleteButton = r.getAllByTitle("Delete");
    expect(deleteButton).toHaveLength(2);
    fireEvent.click(deleteButton[0]);

    expect(r.getByText("Delete transaction category")).toBeInTheDocument();
    fireEvent.click(r.getByText("Delete"));

    await waitFor(() => {
      expect(r.queryByText("Category 2")).toBeNull();
    });

    expect(toastSuccess).not.toHaveBeenCalled();
    expect(toastError).toHaveBeenCalledWith("Error deleting category", {
      description:
        "Transaction category Subcategory 1-1 has a non-existing parent category.",
    });
  });
});
