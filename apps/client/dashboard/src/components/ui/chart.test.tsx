import { render } from "@testing-library/react";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "./chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { describe, expect, test } from "vitest";

const mockData = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 300, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 200, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 278, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 189, pv: 4800, amt: 2181 },
];

const mockConfig = {
  uv: { label: "UV", color: "#8884d8" },
  pv: { label: "PV", color: "#82ca9d" },
};

describe("ChartContainer", () => {
  test("renders without crashing", async () => {
    const { container } = render(
      <ChartContainer
        config={mockConfig}
        style={{ height: "300px", width: "100px" }}
      >
        <BarChart data={mockData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} />
          <Bar dataKey="uv" fill="#8884d8" />
          <Bar dataKey="pv" fill="#82ca9d" />
        </BarChart>
      </ChartContainer>,
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden"
          data-chart="chart-«r0»"
          data-slot="chart"
          style="height: 300px; width: 100px;"
        >
          <style>
            
       [data-chart=chart-«r0»] {
        --color-uv: #8884d8;
        --color-pv: #82ca9d;
      }


      .dark [data-chart=chart-«r0»] {
        --color-uv: #8884d8;
        --color-pv: #82ca9d;
      }

          </style>
          <div
            class="recharts-responsive-container"
            style="width: 100%; height: 100%; min-width: 0;"
          />
        </div>
      </div>
    `);
  });
});

describe("ChartTooltipContent", () => {
  test("renders tooltip content", () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent
          payload={[{ name: "uv", value: 400, color: "#8884d8" }]}
        />
      </ChartContainer>,
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden"
          data-chart="chart-«r1»"
          data-slot="chart"
        >
          <style>
            
       [data-chart=chart-«r1»] {
        --color-uv: #8884d8;
        --color-pv: #82ca9d;
      }


      .dark [data-chart=chart-«r1»] {
        --color-uv: #8884d8;
        --color-pv: #82ca9d;
      }

          </style>
          <div
            class="recharts-responsive-container"
            style="width: 100%; height: 100%; min-width: 0;"
          />
        </div>
      </div>
    `);
  });
});

describe("ChartLegendContent", () => {
  test("renders legend content", () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartLegendContent />
      </ChartContainer>,
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden"
          data-chart="chart-«r2»"
          data-slot="chart"
        >
          <style>
            
       [data-chart=chart-«r2»] {
        --color-uv: #8884d8;
        --color-pv: #82ca9d;
      }


      .dark [data-chart=chart-«r2»] {
        --color-uv: #8884d8;
        --color-pv: #82ca9d;
      }

          </style>
          <div
            class="recharts-responsive-container"
            style="width: 100%; height: 100%; min-width: 0;"
          />
        </div>
      </div>
    `);
  });
});
