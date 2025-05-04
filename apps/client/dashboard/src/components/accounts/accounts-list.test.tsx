import { render, screen, fireEvent } from "@testing-library/react";
import { AccountsList } from "./accounts-list";
import { describe, expect, test } from "vitest";
import { TestContextProvider } from "@/utils/tests/contexts";

describe("AccountsList", () => {
  test("renders the list of accounts", () => {
    render(
      <TestContextProvider>
        <AccountsList />
      </TestContextProvider>,
    );

    expect(screen.getByText("Account 1")).toBeInTheDocument();
    expect(screen.getByText("Account 2")).toBeInTheDocument();
  });

  test("opens the modal when the create account button is clicked", () => {
    render(
      <TestContextProvider>
        <AccountsList />
      </TestContextProvider>,
    );

    fireEvent.click(screen.getByText("Create account"));
    expect(screen.getByText("Create a new account.")).toBeInTheDocument();
  });
});
