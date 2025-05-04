import { TestContextProvider } from "@/utils/tests/contexts";
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { SettingsPage } from "./settings-page";

test("SettingsPage", async () => {
  const { getByText } = render(
    <TestContextProvider>
      <SettingsPage />
    </TestContextProvider>,
  );

  expect(getByText("Symbols")).toBeInTheDocument();
  expect(getByText("Categories")).toBeInTheDocument();
});
