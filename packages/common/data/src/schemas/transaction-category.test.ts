import { describe, expect, test } from "vitest";

import { TransactionCategorySchema } from "./transaction-category";

describe("TransactionCategory", () => {
  test("invalid", () => {
    const category = {
      id: "1",
      name: "user",
      parentTransactionCategoryId: null,
    };
    const { success } = TransactionCategorySchema.safeParse(category);
    expect(success).toBe(true);
  });

  test("invalid", () => {
    const category = {
      id: "1",
    };
    const { success } = TransactionCategorySchema.safeParse(category);
    expect(success).toBe(false);
  });
});
