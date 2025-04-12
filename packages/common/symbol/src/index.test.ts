import { describe, test } from "vitest";
import { FrankfurterCurrencyClient } from "./";

describe("exported", () => {
  test("FrankfurterCurrencyClient", () => {
    new FrankfurterCurrencyClient();
  });
});
