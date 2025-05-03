import { describe, expect, test } from "vitest";
import {
  isCycleInTransactionCategories,
  getTransactionCategoriesWithChildren,
} from "./transaction-category";
import { type TransactionCategory } from "@monyfox/common-data";

describe("isCycleInTransactionCategories", () => {
  test("no cycles", () => {
    const categories: TransactionCategory[] = [
      { id: "1", name: "Category 1", parentTransactionCategoryId: null },
      { id: "1-1", name: "Category 1-1", parentTransactionCategoryId: "1" },
      {
        id: "1-1-1",
        name: "Category 1-1-1",
        parentTransactionCategoryId: "1-1",
      },
      {
        id: "1-1-2",
        name: "Category 1-1-2",
        parentTransactionCategoryId: "1-1",
      },
      { id: "2", name: "Category 2", parentTransactionCategoryId: null },
      { id: "3", name: "Category 3", parentTransactionCategoryId: null },
    ];

    const result = isCycleInTransactionCategories(categories);

    expect(result).toBe(false);
  });

  test("cycle between categories", () => {
    const categories: TransactionCategory[] = [
      { id: "1", name: "Category 1", parentTransactionCategoryId: "2" },
      { id: "2", name: "Category 2", parentTransactionCategoryId: "1" },
    ];

    const result = isCycleInTransactionCategories(categories);

    expect(result).toBe(true);
  });

  test("cycle with itself", () => {
    const categories: TransactionCategory[] = [
      { id: "1", name: "Category 1", parentTransactionCategoryId: "1" },
      { id: "2", name: "Category 2", parentTransactionCategoryId: "1" },
    ];

    const result = isCycleInTransactionCategories(categories);

    expect(result).toBe(true);
  });

  test("empty input", () => {
    const categories: TransactionCategory[] = [];

    const result = isCycleInTransactionCategories(categories);

    expect(result).toBe(false);
  });
});

describe("getTransactionCategoriesWithChildren", () => {
  test("should return a nested structure of transaction categories", () => {
    const categories: TransactionCategory[] = [
      { id: "1", name: "Category 1", parentTransactionCategoryId: null },
      { id: "1-1", name: "Category 1-1", parentTransactionCategoryId: "1" },
      {
        id: "1-1-1",
        name: "Category 1-1-1",
        parentTransactionCategoryId: "1-1",
      },
      {
        id: "1-1-2",
        name: "Category 1-1-2",
        parentTransactionCategoryId: "1-1",
      },
      { id: "2", name: "Category 2", parentTransactionCategoryId: null },
      { id: "3", name: "Category 3", parentTransactionCategoryId: null },
    ];

    const result = getTransactionCategoriesWithChildren(categories);

    expect(result).toEqual([
      {
        id: "1",
        name: "Category 1",
        parentTransactionCategoryId: null,
        children: [
          {
            id: "1-1",
            name: "Category 1-1",
            parentTransactionCategoryId: "1",
            children: [
              {
                id: "1-1-1",
                name: "Category 1-1-1",
                parentTransactionCategoryId: "1-1",
                children: [],
              },
              {
                id: "1-1-2",
                name: "Category 1-1-2",
                parentTransactionCategoryId: "1-1",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "Category 2",
        parentTransactionCategoryId: null,
        children: [],
      },
      {
        id: "3",
        name: "Category 3",
        parentTransactionCategoryId: null,
        children: [],
      },
    ]);
  });

  test("should return an empty array for an empty input", () => {
    const categories: TransactionCategory[] = [];

    const result = getTransactionCategoriesWithChildren(categories);

    expect(result).toEqual([]);
  });
});
