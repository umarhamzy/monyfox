import { z } from "zod";
export declare const TransactionCategorySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    parentTransactionCategoryId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    parentTransactionCategoryId: string | null;
}, {
    id: string;
    name: string;
    parentTransactionCategoryId: string | null;
}>;
//# sourceMappingURL=transaction-category.d.ts.map