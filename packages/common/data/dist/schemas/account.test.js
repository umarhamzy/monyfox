import { describe, expect, test } from "vitest";
import { AccountSchema } from "./account";
describe("AccountSchema", () => {
    test("invalid", () => {
        const account = {
            id: "1",
            name: "Account 1",
            isPersonalAsset: true,
        };
        const { success } = AccountSchema.safeParse(account);
        expect(success).toBe(true);
    });
    test("invalid", () => {
        const account = {
            id: "1",
        };
        const { success } = AccountSchema.safeParse(account);
        expect(success).toBe(false);
    });
});
//# sourceMappingURL=account.test.js.map