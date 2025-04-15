import { TestContextProvider } from "@/utils/tests/contexts";
import { ChartFlowByMonth } from "./chart-flow-by-month";
import { expect, test } from "vitest";
import { render } from "@testing-library/react";

test("ChartFlowByMonth", () => {
  const { container } = render(
    <TestContextProvider>
      <ChartFlowByMonth />
    </TestContextProvider>,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        style="padding: .5rem; max-width: 100%;"
      >
        <div
          style="display: flex; align-items: center; gap: .5rem;"
        >
          <strong
            style="font-size: 1rem;"
          >
            Something went wrong!
          </strong>
          <button
            style="appearance: none; font-size: .6em; border: 1px solid currentColor; padding: .1rem .2rem; font-weight: bold; border-radius: .25rem;"
          >
            Hide Error
          </button>
        </div>
        <div
          style="height: .25rem;"
        />
        <div>
          <pre
            style="font-size: .7em; border: 1px solid red; border-radius: .25rem; padding: .3rem; color: red; overflow: auto;"
          >
            <code>
              ResizeObserver is not defined
            </code>
          </pre>
        </div>
      </div>
    </div>
  `);
});
