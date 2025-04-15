import { describe, expect, test } from "vitest";
import { AccountSchema, AssetSymbolSchema, DataSchema, ProfileSchema, RawDataSchema, TransactionSchema, } from ".";
describe("schemas are exported", () => {
    test("AccountSchema", () => {
        const { success } = AccountSchema.safeParse({});
        expect(success).toBe(false);
    });
    test("AssetSymbolSchema", () => {
        const { success } = AssetSymbolSchema.safeParse({});
        expect(success).toBe(false);
    });
    test("DataSchema", () => {
        const { success } = DataSchema.safeParse({});
        expect(success).toBe(false);
    });
    test("RawDataSchema", () => {
        const { success } = RawDataSchema.safeParse({});
        expect(success).toBe(false);
    });
    test("ProfileSchema", () => {
        const { success } = ProfileSchema.safeParse({});
        expect(success).toBe(false);
    });
    test("TransactionSchema", () => {
        const { success } = TransactionSchema.safeParse({});
        expect(success).toBe(false);
    });
});
//# sourceMappingURL=index.test.js.map