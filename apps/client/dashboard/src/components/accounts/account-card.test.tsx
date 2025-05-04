import { TestContextProvider } from "@/utils/tests/contexts";
import { render, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import { AccountCard } from "./account-card";
import { type Account } from "@monyfox/common-data";

const mockAccount: Account = {
  id: "1",
  name: "Test Account",
  isPersonalAsset: true,
};

test("renders AccountCard component", () => {
  const r = render(
    <TestContextProvider>
      <AccountCard account={mockAccount} />
    </TestContextProvider>,
  );

  expect(r.getByText("Test Account")).toBeInTheDocument();
  expect(r.getByText("0 transactions")).toBeInTheDocument();
});

test("opens Edit Account modal", () => {
  const r = render(
    <TestContextProvider>
      <AccountCard account={mockAccount} />
    </TestContextProvider>,
  );
  expect(r.queryByText("Edit the account.")).not.toBeInTheDocument();

  fireEvent.click(r.getByTitle("Edit"));
  expect(r.queryByText("Edit the account.")).toBeInTheDocument();
});
