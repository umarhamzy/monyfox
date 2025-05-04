import { TestContextProvider } from "@/utils/tests/contexts";
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { DashboardPage } from "./dashboard-page";

test("DashboardPage", () => {
  const r = render(
    <TestContextProvider>
      <DashboardPage />
    </TestContextProvider>,
  );

  expect(r.getByText("Balance")).toBeInTheDocument();
  expect(r.getByText("Transactions")).toBeInTheDocument();
});
