import { z } from "zod";
export declare const AccountSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    isPersonalAsset: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    isPersonalAsset: boolean;
}, {
    id: string;
    name: string;
    isPersonalAsset: boolean;
}>;
//# sourceMappingURL=account.d.ts.map