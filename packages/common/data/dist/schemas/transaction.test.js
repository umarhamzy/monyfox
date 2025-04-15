import { describe, expect, it } from "vitest";
import { TransactionSchema } from "./transaction";
describe("TransactionSchema", () => {
    it("valid", () => {
        const validTransaction = {
            id: "1",
            description: "Test transaction",
            transactionCategoryId: "category1",
            transactionDate: "2023-10-01",
            accountingDate: "2023-10-02",
            from: {
                amount: 100,
                symbolId: "USD",
                account: {
                    id: "account1",
                },
            },
            to: {
                amount: 100,
                symbolId: "USD",
                account: {
                    id: "account2",
                },
            },
        };
        const { success } = TransactionSchema.safeParse(validTransaction);
        expect(success).toBe(true);
    });
    it("invalid", () => {
        const invalidTransaction = {
            id: "1",
        };
        const { success } = TransactionSchema.safeParse(invalidTransaction);
        expect(success).toBe(false);
    });
});
//# sourceMappingURL=transaction.test.js.map