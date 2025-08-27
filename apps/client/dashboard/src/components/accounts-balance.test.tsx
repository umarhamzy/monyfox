import { TestContextProvider } from "@/utils/tests/contexts";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { AccountsBalance } from "./accounts-balance";
import { render } from "@testing-library/react";

const originalLanguageDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  "language",
);

beforeEach(() => {
  Object.defineProperty(navigator, "language", {
    value: "it-IT",
    configurable: true,
  });
});

afterEach(() => {
  if (originalLanguageDescriptor) {
    Object.defineProperty(navigator, "language", originalLanguageDescriptor);
  }
});

describe("AccountsBalance", () => {
  test("set default symbol", async () => {
    const { getAllByText } = render(
      <TestContextProvider>
        <AccountsBalance />
      </TestContextProvider>,
    );

    const total = getAllByText(/1877,00\s€/);
    expect(total.length).toBe(2);
  });
});
