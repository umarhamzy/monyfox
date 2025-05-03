import { describe, expect, test } from "vitest";
import { generateTestProfile, getDataValidationErrors } from "./data";
import { type Data } from "@monyfox/common-data";

describe("generateTestProfile", () => {
  test("generate a profile with the correct structure", () => {
    const profile = generateTestProfile();

    if (profile.data.encrypted === true) {
      throw new Error("Profile should not be encrypted");
    }

    expect(profile.data.data.accounts.length).toBeGreaterThan(0);
    expect(profile.data.data.transactions.length).toBeGreaterThan(0);
    expect(profile.data.data.transactionCategories.length).toBeGreaterThan(0);
    expect(profile.data.data.assetSymbols.length).toBeGreaterThan(0);
  });
});

describe("getDataValidationErrors", () => {
  test("should return an error for cycles in transaction categories", () => {
    const data: Data = {
      accounts: [],
      transactions: [],
      transactionCategories: [
        { id: "1", name: "Category 1", parentTransactionCategoryId: "2" },
        { id: "2", name: "Category 2", parentTransactionCategoryId: "1" },
      ],
      assetSymbols: [],
      assetSymbolExchanges: [],
      assetSymbolExchangersMetadata: { alphavantage: null },
      lastUpdated: new Date().toISOString(),
    };

    const errors = getDataValidationErrors(data);
    expect(errors).toContain("There are cycles in the transaction categories");
  });

  test("should return an error for non-existing parent category", () => {
    const data: Data = {
      accounts: [],
      transactions: [],
      transactionCategories: [
        { id: "1", name: "Category 1", parentTransactionCategoryId: "2" },
      ],
      assetSymbols: [],
      assetSymbolExchanges: [],
      assetSymbolExchangersMetadata: { alphavantage: null },
      lastUpdated: new Date().toISOString(),
    };

    const errors = getDataValidationErrors(data);
    expect(errors).toContain(
      "Transaction category Category 1 has a non-existing parent category",
    );
  });

  test("should return no errors for valid data", () => {
    const data: Data = {
      accounts: [],
      transactions: [],
      transactionCategories: [
        { id: "1", name: "Category 1", parentTransactionCategoryId: null },
        { id: "2", name: "Category 2", parentTransactionCategoryId: "1" },
      ],
      assetSymbols: [],
      assetSymbolExchanges: [],
      assetSymbolExchangersMetadata: { alphavantage: null },
      lastUpdated: new Date().toISOString(),
    };

    const errors = getDataValidationErrors(data);
    expect(errors).toHaveLength(0);
  });
});
