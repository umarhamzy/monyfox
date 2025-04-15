import { z } from "zod";
export const TransactionCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    parentTransactionCategoryId: z.string().nullable(),
});
//# sourceMappingURL=transaction-category.js.map