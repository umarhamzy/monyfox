import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { ErrorPage } from "./error-page";
import { TestContextProvider } from "@/utils/tests/contexts";

describe("ErrorPage", () => {
  test("set default symbol", async () => {
    const { getByText } = render(
      <TestContextProvider>
        <ErrorPage
          title="My test error title"
          message="My test error message"
        />
      </TestContextProvider>,
    );

    expect(getByText("My test error title")).toBeDefined();
    expect(getByText("My test error message")).toBeDefined();
  });
});