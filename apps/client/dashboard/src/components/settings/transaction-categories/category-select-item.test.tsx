import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { SelectItemTransactionCategoryWithChildren } from "./category-select-item";
import { type TransactionCategoryWithChildren } from "@/utils/transaction-category";
import { Select, SelectContent } from "@/components/ui/select";

describe("SelectItemTransactionCategoryWithChildren", () => {
  test("renders category with no children", () => {
    const category: TransactionCategoryWithChildren = {
      id: "1",
      name: "Category 1",
      parentTransactionCategoryId: null,
      children: [],
    };

    const { getByText } = render(
      <Select>
        <SelectContent>
          <SelectItemTransactionCategoryWithChildren
            category={category}
            level={0}
          />
        </SelectContent>
      </Select>,
    );

    expect(getByText("Category 1")).toBeDefined();
  });

  test("renders nested categories", () => {
    const category: TransactionCategoryWithChildren = {
      id: "1",
      name: "Category 1",
      parentTransactionCategoryId: null,
      children: [
        {
          id: "2",
          name: "Subcategory 1",
          parentTransactionCategoryId: "1",
          children: [
            {
              id: "4",
              name: "Sub-subcategory 1",
              parentTransactionCategoryId: "2",
              children: [],
            },
          ],
        },
        {
          id: "3",
          name: "Subcategory 2",
          parentTransactionCategoryId: "1",
          children: [],
        },
      ],
    };

    const { getByText } = render(
      <Select>
        <SelectContent>
          <SelectItemTransactionCategoryWithChildren
            category={category}
            level={0}
          />
        </SelectContent>
      </Select>,
    );

    expect(getByText("Category 1")).toBeDefined();
    expect(getByText("- Subcategory 1")).toBeDefined();
    expect(getByText("-- Sub-subcategory 1")).toBeDefined();
    expect(getByText("- Subcategory 2")).toBeDefined();
  });
});
