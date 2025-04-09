import { z } from "zod";
import { AccountSchema } from "./schemas/account";
import { AssetSymbolSchema } from "./schemas/asset-symbol";
import { DataSchema, RawDataSchema } from "./schemas/data";
import { ProfileSchema } from "./schemas/profile";
import { TransactionSchema } from "./schemas/transaction";

export default {
  AccountSchema,
  AssetSymbolSchema,
  TransactionSchema,
  DataSchema,
  RawDataSchema,
  ProfileSchema,
};

export type Account = z.infer<typeof AccountSchema>;
export type AssetSymbol = z.infer<typeof AssetSymbolSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type Data = z.infer<typeof DataSchema>;
export type RawData = z.infer<typeof RawDataSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
