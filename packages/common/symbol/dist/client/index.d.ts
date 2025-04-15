import { z } from "zod";
export declare const CurrencySchema: z.ZodRecord<z.ZodString, z.ZodString>;
type Currency = z.infer<typeof CurrencySchema>;
export interface CurrencyClient {
    getCurrencies(): Promise<Currency[]>;
}
export {};
//# sourceMappingURL=index.d.ts.map