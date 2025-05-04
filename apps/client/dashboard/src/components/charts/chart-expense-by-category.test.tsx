import { TestContextProvider } from "@/utils/tests/contexts";
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { ChartExpenseByCategory } from "./chart-expense-by-category";

test("ChartExpenseByCategory", () => {
  const { container } = render(
    <TestContextProvider>
      <ChartExpenseByCategory />
    </TestContextProvider>,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full"
        data-slot="sidebar-wrapper"
        style="--sidebar-width: 16rem; --sidebar-width-icon: 3rem;"
      >
        <div
          class="bg-card text-card-foreground gap-6 rounded-xl border py-6 shadow-sm flex flex-col"
          data-slot="card"
        >
          <div
            class="@container/card-header grid auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 items-center pb-0"
            data-slot="card-header"
          >
            <div
              class="leading-none font-semibold"
              data-slot="card-title"
            >
              Expenses
            </div>
            <div
              class="text-muted-foreground text-sm"
              data-slot="card-description"
            >
              This month so far.
            </div>
          </div>
          <div
            class="px-6 flex-1 pb-0"
            data-slot="card-content"
          >
            <div
              class="[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden mx-auto aspect-square max-h-[250px]"
              data-chart="chart-«r0»"
              data-slot="chart"
            >
              <div
                class="recharts-responsive-container"
                style="width: 100%; height: 100%; min-width: 0;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
});
