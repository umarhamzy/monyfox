import { TestContextProvider } from "@/utils/tests/contexts";
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { NetWorthByMonth } from "./chart-net-worth-by-month";

test("NetWorthByMonth", () => {
  const { container } = render(
    <TestContextProvider>
      <NetWorthByMonth />
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
          class="[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden h-[300px] w-full"
          data-chart="chart-«r0»"
          data-slot="chart"
          data-testid="net-worth-chart"
        >
          <style>
            
     [data-chart=chart-«r0»] {
      --color-balance: #8884d8;
    }


    .dark [data-chart=chart-«r0»] {
      --color-balance: #8884d8;
    }

          </style>
          <div
            class="recharts-responsive-container"
            style="width: 100%; height: 100%; min-width: 0;"
          />
        </div>
      </div>
    </div>
  `);
});
