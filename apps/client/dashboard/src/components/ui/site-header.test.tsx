import { render } from "@testing-library/react";
import { test, expect } from "vitest";
import { SiteHeader } from "./site-header";
import { TestContextProvider } from "@/utils/tests/contexts";

test("SiteHeader", () => {
  const { getByText } = render(
    <TestContextProvider>
      <SiteHeader />
    </TestContextProvider>,
  );
  expect(getByText("Dashboard")).toBeInTheDocument();
});
