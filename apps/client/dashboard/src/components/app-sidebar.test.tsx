import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { AppSidebar } from "./app-sidebar";
import { TestContextProvider } from "@/utils/tests/contexts";

test("AppSidebar", () => {
  const { getByText } = render(
    <TestContextProvider>
      <AppSidebar />
    </TestContextProvider>,
  );

  expect(getByText("Monyfox")).toBeDefined();
  expect(getByText("Dashboard")).toBeDefined();
  expect(getByText("Accounts")).toBeDefined();
  expect(getByText("Transactions")).toBeDefined();
  expect(getByText("TEST_USER")).toBeDefined();
});
