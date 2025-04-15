import { render } from "@testing-library/react";
import { describe, expect } from "vitest";
import { SiteHeader } from "./site-header";
import { TestContextProvider } from "@/utils/tests/contexts";

describe("SiteHeader", () => {
  const { getByText } = render(
    <TestContextProvider>
      <SiteHeader />
    </TestContextProvider>,
  );
  expect(getByText("Dashboard")).toBeInTheDocument();
});
