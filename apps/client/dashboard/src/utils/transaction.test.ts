import { describe, expect, test } from "vitest";
import { getTransactionType } from "./transaction";

describe("getTransactionType", () => {
  test("income", () => {
    expect(
      getTransactionType(
        {
          id: "1",
          description: "test",
          accountingDate: "2025-01-01",
          transactionDate: "2025-01-01",
          transactionCategoryId: null,
          from: {
            amount: 100,
            symbolId: "EUR",
            account: {
              id: "1",
            },
          },
          to: {
            amount: 100,
            symbolId: "EUR",
            account: {
              id: "2",
            },
          },
        },
        (accountId) => ({
          id: accountId,
          name: "test",
          isPersonalAsset: accountId === "2",
        }),
      ),
    ).toBe("income");
  });

  test("expense", () => {
    expect(
      getTransactionType(
        {
          id: "1",
          description: "test",
          accountingDate: "2025-01-01",
          transactionDate: "2025-01-01",
          transactionCategoryId: null,
          from: {
            amount: 100,
            symbolId: "EUR",
            account: {
              id: "2",
            },
          },
          to: {
            amount: 100,
            symbolId: "EUR",
            account: {
              id: "1",
            },
          },
        },
        (accountId) => ({
          id: accountId,
          name: "test",
          isPersonalAsset: accountId === "2",
        }),
      ),
    ).toBe("expense");
  });

  test("transfer", () => {
    expect(
      getTransactionType(
        {
          id: "1",
          description: "test",
          accountingDate: "2025-01-01",
          transactionDate: "2025-01-01",
          transactionCategoryId: null,
          from: {
            amount: 100,
            symbolId: "EUR",
            account: {
              id: "1",
            },
          },
          to: {
            amount: 100,
            symbolId: "EUR",
            account: {
              id: "2",
            },
          },
        },
        (accountId) => ({
          id: accountId,
          name: "test",
          isPersonalAsset: true,
        }),
      ),
    ).toBe("transfer");
  });

  test("unknown", () => {
    expect(
      getTransactionType(
        {
          id: "1",
          description: "test",
          accountingDate: "2025-01-01",
          transactionDate: "2025-01-01",
          transactionCategoryId: null,
          from: {
            amount: 100,
            symbolId: "EUR",
            account: {
              name: "test 1",
            },
          },
          to: {
            amount: 100,
            symbolId: "EUR",
            account: {
              name: "test 2",
            },
          },
        },
        (accountId) => ({
          id: accountId,
          name: "test",
          isPersonalAsset: false,
        }),
      ),
    ).toBe("unknown");
  });
});
