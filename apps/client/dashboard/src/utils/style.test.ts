import { describe, expect, test } from "vitest";
import { cn } from "./style";

describe("cn", () => {
  test("return the correct class name", () => {
    expect(cn("cn1", "cn2")).toBe("cn1 cn2");
  });
});
