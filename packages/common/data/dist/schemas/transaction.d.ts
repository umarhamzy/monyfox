import { z } from "zod";
export declare const TransactionSchema: z.ZodObject<{
    id: z.ZodString;
    description: z.ZodString;
    transactionCategoryId: z.ZodNullable<z.ZodString>;
    transactionDate: z.ZodString;
    accountingDate: z.ZodString;
    from: z.ZodObject<{
        amount: z.ZodNumber;
        symbolId: z.ZodString;
        account: z.ZodUnion<[z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>, z.ZodObject<{
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
        }, {
            name: string;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        symbolId: string;
        account: {
            id: string;
        } | {
            name: string;
        };
    }, {
        amount: number;
        symbolId: string;
        account: {
            id: string;
        } | {
            name: string;
        };
    }>;
    to: z.ZodObject<{
        amount: z.ZodNumber;
        symbolId: z.ZodString;
        account: z.ZodUnion<[z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>, z.ZodObject<{
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
        }, {
            name: string;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        symbolId: string;
        account: {
            id: string;
        } | {
            name: string;
        };
    }, {
        amount: number;
        symbolId: string;
        account: {
            id: string;
        } | {
            name: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    description: string;
    transactionCategoryId: string | null;
    transactionDate: string;
    accountingDate: string;
    from: {
        amount: number;
        symbolId: string;
        account: {
            id: string;
        } | {
            name: string;
        };
    };
    to: {
        amount: number;
        symbolId: string;
        account: {
            id: string;
        } | {
            name: string;
        };
    };
}, {
    id: string;
    description: string;
    transactionCategoryId: string | null;
    transactionDate: string;
    accountingDate: string;
    from: {
        amount: number;
        symbolId: string;
        account: {
            id: string;
        } | {
            name: string;
        };
    };
    to: {
        amount: number;
        symbolId: string;
        account: {
            id: string;
        } | {
            name: string;
        };
    };
}>;
//# sourceMappingURL=transaction.d.ts.map