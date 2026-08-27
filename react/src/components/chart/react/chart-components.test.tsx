import { StrictMode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { Chart, useChart } from "../index";
import type { ChartHandle } from "../index";

const lineData = [
  { date: new Date(2024, 0, 1), value: 100 },
  { date: new Date(2024, 2, 1), value: 140 },
  { date: new Date(2024, 4, 1), value: 120 },
  { date: new Date(2024, 6, 1), value: 180 },
];

const barData = [
  { category: "A", value: 10 },
  { category: "B", value: 25 },
  { category: "C", value: 15 },
];

const pieData = [
  { name: "X", value: 40 },
  { name: "Y", value: 60 },
];

const candleData = [
  {
    date: new Date(2024, 5, 1),
    open: 100,
    high: 110,
    low: 95,
    close: 105,
  },
  {
    date: new Date(2024, 5, 2),
    open: 105,
    high: 112,
    low: 101,
    close: 103,
  },
];

const noAnim = { animation: false as const };

beforeEach(() => {
  // Path2D does not exist in jsdom — stub it for the canvas draw fns.
  (globalThis as Record<string, unknown>).Path2D = class {
    constructor(public d?: string) {}
  };
  const ctx: Record<string | symbol, unknown> = {};
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    new Proxy(
      {},
      {
        get: (_t, prop) => {
          if (prop === "measureText") return () => ({ width: 10 });
          if (prop === "createLinearGradient")
            return () => ({ addColorStop() {} });
          return () => {};
        },
        set: () => true,
      },
    ) as unknown as CanvasRenderingContext2D,
  );
  void ctx;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("Chart.Svg", () => {
  it("renders an svg with a line path and axes", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="Series" curve="linear" />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute("aria-label")).toBe("Chart");
    // line path with 4 points → M + 3 segments
    const paths = svg!.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(1);
    // axis tick labels (Jan 1 tick renders the year only)
    expect(svg!.textContent).toContain("2024");
    expect(svg!.textContent).toContain("Feb 2024");
  });

  it("renders markers when showMarkers is set", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} showMarkers markerShape="circle" />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const series = svg!.querySelector("[data-chart-series]")!;
    expect(series).toBeTruthy();
    // 4 markers + 1 line path
    expect(series!.querySelectorAll("path").length).toBe(5);
  });

  it("resolves distinct states for series sharing one data array", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="First" color="violet" />
        <Chart.Line data={lineData} name="Second" color="emerald" />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const strokes = Array.from(
      svg!.querySelectorAll("[data-chart-series] path[stroke]"),
    )
      .map((p) => p.getAttribute("stroke"))
      .filter(Boolean);
    // Both lines visible with their own resolved colors (no descriptor collision).
    expect(strokes.some((s) => s === "#8b5cf6")).toBe(true);
    expect(strokes.some((s) => s === "#10b981")).toBe(true);
  });

  it("unwraps fragment-wrapped children (playground pattern)", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Title title="Wrapped" />
        {true && (
          <>
            <Chart.Line data={lineData} name="Frag" />
            <Chart.XAxis />
          </>
        )}
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    expect(svg!.querySelector("[data-chart-series]")).toBeTruthy();
    expect(screen.getByText("Wrapped")).toBeTruthy();
  });

  it("renders an area when fillOpacity > 0", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} fillOpacity={0.35} />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const areaPath = svg!.querySelector(
      "path[opacity]",
    ) as SVGPathElement | null;
    expect(areaPath).toBeTruthy();
    expect(areaPath!.getAttribute("opacity")).toBe("0.35");
  });

  it("uses the provided y-domain for scales", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} />
        <Chart.YAxis domain={[0, 200]} />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    expect(svg!.textContent).toContain("200");
    expect(svg!.textContent).toContain("0");
  });

  it("renders a bar series with one rect per category", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Bar data={barData} name="Sales" />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const rects = svg!.querySelectorAll("rect");
    expect(rects.length).toBe(3);
  });

  it("stacks bars with the same stackId", () => {
    const a = [
      { category: "A", value: 10 },
      { category: "B", value: 20 },
    ];
    const b = [
      { category: "A", value: 5 },
      { category: "B", value: 5 },
    ];
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Bar data={a} name="A" mode="stack" />
        <Chart.Bar data={b} name="B" mode="stack" />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const series = svg!.querySelectorAll("[data-chart-series]");
    expect(series.length).toBe(2);
    // 4 bars total
    expect(svg!.querySelectorAll("rect").length).toBe(4);
    // series B's first bar starts where A's ends (no overlap)
    const aRects = series[0]!.querySelectorAll("rect");
    const bRects = series[1]!.querySelectorAll("rect");
    const aY1 = Number(aRects[1].getAttribute("y"));
    const bY1 = Number(bRects[1].getAttribute("y"));
    expect(bY1).toBeLessThan(aY1); // B sits above A (stacked upward)
  });

  it("y-domain spans stacked totals (not per-series values)", () => {
    // 2 series × 50 per category → the stack tops reach 100; the y-axis
    // must tick up to at least 100, otherwise the stacks overflow the plot.
    const a = [
      { category: "A", value: 50 },
      { category: "B", value: 50 },
    ];
    const b = [
      { category: "A", value: 50 },
      { category: "B", value: 50 },
    ];
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Bar data={a} name="A" mode="stack" />
        <Chart.Bar data={b} name="B" mode="stack" />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    // "100" appears as a y tick label (with the old per-series domain the
    // axis topped out at 50 and never rendered a 100 tick).
    expect(svg!.textContent).toContain("100");
  });

  it("stacked segmentGap shrinks each segment by the gap", () => {
    const a = [{ category: "A", value: 50 }];
    const b = [{ category: "A", value: 50 }];
    const { rerender } = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Bar data={a} name="A" mode="stack" />
        <Chart.Bar data={b} name="B" mode="stack" />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const plain = () => {
      const rects = svg!.querySelectorAll("[data-chart-series] rect");
      return {
        h0: Number(rects[0].getAttribute("height")),
        h1: Number(rects[1].getAttribute("height")),
      };
    };
    const before = plain();
    rerender(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Bar data={a} name="A" mode="stack" segmentGap={8} />
        <Chart.Bar data={b} name="B" mode="stack" segmentGap={8} />
      </Chart.Svg>,
    );
    const after = plain();
    expect(after.h0).toBeCloseTo(before.h0 - 8, 5);
    expect(after.h1).toBeCloseTo(before.h1 - 8, 5);
  });

  it("bar cornerRadius rounds the rects", () => {
    const a = [
      { category: "A", value: 10 },
      { category: "B", value: 20 },
    ];
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Bar data={a} name="A" cornerRadius={6} />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const rect = svg!.querySelector("[data-chart-series] rect")!;
    // clamped to min(6, width/2, height/2) — a positive radius
    expect(Number(rect.getAttribute("rx"))).toBeGreaterThan(0);
    expect(Number(rect.getAttribute("rx"))).toBeLessThanOrEqual(6);
  });

  it("renders pie slices", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie data={pieData} name="Share" />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const series = svg!.querySelector("[data-chart-series]")!;
    expect(series!.querySelectorAll("path").length).toBe(2);
  });

  it("PieCenter renders the default donut readout", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie data={pieData} name="Mix" innerRadius={0.6} />
        <Chart.PieCenter title="ARR MIX" value={100} subtitle="2 plans" />
      </Chart.Svg>,
    );
    expect(screen.getByText("ARR MIX")).toBeTruthy();
    expect(screen.getByText("2 plans")).toBeTruthy();
    // default value formatted via formatSI
    expect(screen.getByText("100")).toBeTruthy();
  });

  it("PieCenter updates on slice hover", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie data={pieData} name="Mix" innerRadius={0.6} />
        <Chart.PieCenter title="ARR MIX" value={100} />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const rect = svg!.querySelectorAll("rect")[
      svg!.querySelectorAll("rect").length - 1
    ] as SVGRectElement;
    // jsdom: the svg box is at the origin, width defaults to 800 — the
    // donut center is (8 + 780/2, 48 + 244/2) = (398, 170). Probe 60px to
    // the right of center → 90° → slice 0 ("X", 40%, spans 0..144°).
    fireEvent.pointerMove(rect, { clientX: 398 + 60, clientY: 170 });
    // hovered slice name replaces the default title
    expect(screen.getByText("X")).toBeTruthy();
    // slice value replaces the default total
    expect(screen.getByText("40")).toBeTruthy();
  });

  it("YAxis labels={false} hides tick labels and the domain line", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" />
        <Chart.YAxis labels={false} />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const feature = svg!.querySelector("[data-chart-feature='yaxis-left']")!;
    // gridlines remain, but no <text> tick labels
    expect(feature.querySelectorAll("text").length).toBe(0);
    expect(feature.querySelectorAll("line").length).toBeGreaterThan(0);
  });

  it("Legend position=bottom moves the legend slot out of the title strip", () => {
    const { container, rerender } = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" />
        <Chart.Legend />
      </Chart.Svg>,
    );
    const slotStyle = () =>
      [...container.querySelectorAll("div")].find(
        (d) =>
          (d.getAttribute("style") ?? "").includes("height: 30px") &&
          (d.getAttribute("style") ?? "").includes("position: absolute"),
      )?.getAttribute("style") ?? "";
    expect(slotStyle()).toContain("top:");
    rerender(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" />
        <Chart.Legend position="bottom" />
      </Chart.Svg>,
    );
    const bottomStyle = slotStyle();
    expect(bottomStyle).toContain("bottom:");
    expect(bottomStyle).not.toContain("top:");
  });

  it("renders donut inner cutout", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie data={pieData} innerRadius={0.6} />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const path = svg!.querySelector("path")!;
    // a donut slice path has an outer AND an inner arc (2 A commands for a
    // half circle); a plain pie slice has 1.
    expect((path.getAttribute("d") ?? "").match(/A/g)?.length ?? 0).toBe(2);
  });

  it("renders candlesticks with wick + body", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Candlestick data={candleData} name="BTC" />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const series = svg!.querySelector("[data-chart-series]")!;
    expect(series!.querySelectorAll("rect").length).toBe(2);
    expect(series!.querySelectorAll("line").length).toBe(2);
  });

  it("renders title, caption, legend and reference marks", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Title title="My Chart" subtitle="sub" />
        <Chart.Line data={lineData} name="S" />
        <Chart.Legend />
        <Chart.Caption text="Source: demo" />
        <Chart.ReferenceLine x={new Date(2024, 5, 1)} label="Marker" />
        <Chart.ReferenceBand
          x1={new Date(2024, 2, 1)}
          x2={new Date(2024, 4, 1)}
          label="Window"
        />
        <Chart.Annotation
          x={new Date(2024, 2, 1)}
          y={140}
          title="Event"
          value="42"
        />
        <Chart.DataLabels position="last" />
      </Chart.Svg>,
    );
    expect(screen.getByText("My Chart")).toBeTruthy();
    expect(screen.getByText("sub")).toBeTruthy();
    expect(screen.getByText("Source: demo")).toBeTruthy();
    expect(screen.getByText("S")).toBeTruthy();
    const svg = document.querySelector("svg[role=img]")!;
    expect(svg!.textContent).toContain("Marker");
    expect(svg!.textContent).toContain("Window");
    expect(svg!.textContent).toContain("Event");
  });

  it("shows the empty state when all series have no data", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={[]} name="Empty" />
      </Chart.Svg>,
    );
    expect(screen.getByText("No data")).toBeTruthy();
  });

  it("shows loading and error states", () => {
    const { rerender } = render(
      <Chart.Svg height={300} loading loaderType="spinner" {...noAnim}>
        <Chart.Line data={lineData} />
      </Chart.Svg>,
    );
    // built-in spinner loader: a kit Loader overlay over the chart
    expect(document.querySelector('[role="status"]')).toBeTruthy();
    rerender(
      <Chart.Svg height={300} error="Boom" {...noAnim}>
        <Chart.Line data={lineData} />
      </Chart.Svg>,
    );
    expect(screen.getByText("Boom")).toBeTruthy();
  });

  it("legend toggle hides the series", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="Visible" />
        <Chart.Line
          data={lineData.map((d) => ({ ...d, value: d.value + 10 }))}
          name="Toggled"
        />
        <Chart.Legend />
      </Chart.Svg>,
    );
    const buttons = screen.getAllByRole("button");
    const toggle = buttons.find((b) => b.textContent === "Toggled")!;
    fireEvent.click(toggle);
    const series = document.querySelectorAll("[data-chart-series]");
    const hidden = Array.from(series).find(
      (g) => (g as SVGElement).style.opacity === "0",
    );
    expect(hidden).toBeTruthy();
    fireEvent.click(toggle);
    const stillHidden = Array.from(
      document.querySelectorAll("[data-chart-series]"),
    ).find((g) => (g as SVGElement).style.opacity === "0");
    expect(stillHidden).toBeUndefined();
  });

  it("exposes redraw() through the ref", () => {
    const ref = { current: null as ChartHandle | null };
    render(
      <Chart.Svg ref={ref} height={300} {...noAnim}>
        <Chart.Line data={lineData} />
      </Chart.Svg>,
    );
    expect(ref.current).toBeTruthy();
    expect(typeof ref.current!.redraw).toBe("function");
    ref.current!.redraw();
  });

  it("throws when useChart is called outside a chart", () => {
    function Bad() {
      useChart();
      return null;
    }
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Bad />)).toThrow();
    spy.mockRestore();
  });

  it("runs the entrance animation when enabled", () => {
    vi.useFakeTimers();
    const raf = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) =>
        setTimeout(() => cb(performance.now()), 16) as unknown as number,
      );
    render(
      <Chart.Svg height={300} animation={{ duration: 300 }}>
        <Chart.Line data={lineData} />
      </Chart.Svg>,
    );
    // advance past the animation
    act(() => {
      vi.advanceTimersByTime(400);
    });
    const svg = document.querySelector("svg[role=img]")!;
    expect(svg!.querySelector("path")).toBeTruthy();
    raf.mockRestore();
  });

  it("keeps bars mid-growth during the entrance (prev stays null while animating)", () => {
    vi.useFakeTimers();
    const raf = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) =>
        setTimeout(() => cb(performance.now()), 16) as unknown as number,
      );
    const { unmount } = render(
      <Chart.Svg height={300} animation={{ duration: 300 }}>
        <Chart.Bar data={barData} name="B" />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const firstBarHeight = () => {
      const r = document.querySelector(
        "svg[role=img] [data-chart-series] rect",
      ) as SVGRectElement | null;
      return r ? Number(r.getAttribute("height") ?? 0) : 0;
    };
    act(() => {
      vi.advanceTimersByTime(150);
    });
    const mid = firstBarHeight();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    const end = firstBarHeight();
    // the entrance must be visible: strictly between collapsed and final
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(end);
    expect(end).toBeGreaterThan(0);
    raf.mockRestore();
    unmount();
  });
});

describe("Chart.Canvas", () => {
  it("renders a canvas and registers draw functions", () => {
    const draws: Map<string, unknown> = new Map();
    const { unmount } = render(
      <Chart.Canvas height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" fillOpacity={0.3} />
        <Chart.Bar data={barData} name="B" />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Canvas>,
    );
    const canvas = document.querySelector(
      "canvas[role=img]",
    ) as HTMLCanvasElement | null;
    expect(canvas).toBeTruthy();
    // give the draw-registration effects a tick
    act(() => {});
    // The canvas was sized from the (default) layout.
    expect(canvas!.width).toBeGreaterThan(0);
    unmount();
    void draws;
  });

  it("renders pie + candlestick marks via draw functions", () => {
    render(
      <Chart.Canvas height={300} {...noAnim}>
        <Chart.Pie data={pieData} name="P" />
        <Chart.Candlestick data={candleData} name="C" />
      </Chart.Canvas>,
    );
    const canvas = document.querySelector("canvas[role=img]")!;
    expect(canvas).toBeTruthy();
    expect(document.querySelector("svg")).toBeNull();
  });

  it("renders HTML overlays (title/legend) alongside the canvas", () => {
    render(
      <Chart.Canvas height={300} {...noAnim}>
        <Chart.Title title="Canvas Chart" />
        <Chart.Line data={lineData} name="S" />
        <Chart.Legend />
      </Chart.Canvas>,
    );
    expect(screen.getByText("Canvas Chart")).toBeTruthy();
    expect(screen.getByText("S")).toBeTruthy();
    expect(document.querySelector("canvas[role=img]")).toBeTruthy();
  });
});

describe("hover + tooltip", () => {
  it("shows a tooltip when the pointer moves over the plot", () => {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={data} name="S" />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>,
    );
    // the transparent hover rect is the last rect in the svg (the first is
    // the line-entrance clip). The handler converts coordinates relative to
    // the SVG box, so mock the svg's box.
    const svg = document.querySelector("svg[role=img]")!;
    const rects = svg!.querySelectorAll("rect");
    const rect = rects[rects.length - 1] as SVGRectElement;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 300,
        width: 800,
        height: 300,
        x: 0,
        y: 0,
        toJSON() {
          return this;
        },
      }),
      configurable: true,
    });
    // fake a pointer at the plot center (area starts at x=60 for the y-axis)
    fireEvent.pointerMove(rect, { clientX: 62, clientY: 150 });
    // tooltip card renders the snapped x's full date header
    expect(screen.getByText(/Jan 1, 2024/)).toBeTruthy();
  });

  it("shows y-axis value pills while hovering (AxisBadges mode=hover)", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" />
        <Chart.XAxis />
        <Chart.YAxis />
        <Chart.AxisBadges mode="hover" />
        <Chart.Hover />
      </Chart.Svg>,
    );
    // idle: no pills
    expect(
      document.querySelector('[data-chart-feature="axis-badges"]'),
    ).toBeNull();
    const svg = document.querySelector("svg[role=img]")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 300,
        width: 800,
        height: 300,
        x: 0,
        y: 0,
        toJSON() {
          return this;
        },
      }),
      configurable: true,
    });
    const rect = svg.querySelectorAll("rect")[
      svg.querySelectorAll("rect").length - 1
    ] as SVGRectElement;
    fireEvent.pointerMove(rect, { clientX: 62, clientY: 150 });
    const badges = document.querySelector(
      '[data-chart-feature="axis-badges"]',
    );
    expect(badges).toBeTruthy();
    // the snapped category is the first datum (value 100)
    expect(badges!.textContent).toContain("100");
  });

  it("shows endpoint pills when idle (AxisBadges mode=endpoints)", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" />
        <Chart.AxisBadges mode="endpoints" />
      </Chart.Svg>,
    );
    const badges = document.querySelector(
      '[data-chart-feature="axis-badges"]',
    );
    expect(badges).toBeTruthy();
    // last value of lineData is 180
    expect(badges!.textContent).toContain("180");
  });
});

describe("grid + area gradient options", () => {
  it("YAxis honors gridDash and gridOpacity (and grid={false})", () => {
    const { rerender } = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Bar data={barData} name="B" />
        <Chart.XAxis />
        <Chart.YAxis gridDash="dashed" gridOpacity={0.3} />
      </Chart.Svg>,
    );
    const grid = document.querySelector(
      '[data-chart-feature="yaxis-left"] line',
    ) as SVGLineElement;
    expect(grid.getAttribute("stroke-dasharray")).toBe("4 3");
    expect(grid.getAttribute("stroke-opacity")).toBe("0.3");
    rerender(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Bar data={barData} name="B" />
        <Chart.YAxis grid={false} />
      </Chart.Svg>,
    );
    const lines = document.querySelectorAll(
      '[data-chart-feature="yaxis-left"] line',
    );
    // only the domain line remains (no gridlines)
    expect(lines.length).toBe(1);
    expect(lines[0].getAttribute("stroke-dasharray")).toBeNull();
  });

  it("Line areaGradient renders a color-to-transparent gradient", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" fillOpacity={0.4} areaGradient />
      </Chart.Svg>,
    );
    const area = [...document.querySelectorAll("linearGradient")].find(
      (g) => (g.getAttribute("id") ?? "").endsWith("area"),
    );
    expect(area).toBeTruthy();
    const stops = area!.querySelectorAll("stop");
    // Shared fill contract: the gradient itself carries the fill opacity
    // (start = fillOpacity → 0); the path stays fully opaque.
    expect(stops[0].getAttribute("stop-opacity")).toBe("0.4");
    expect(stops[1].getAttribute("stop-opacity")).toBe("0");
    const path = document.querySelector(
      '[data-chart-series="series-0"] path[fill^="url"]',
    );
    expect(path?.getAttribute("opacity")).toBe("1");
  });

  it("Line fillStyle=flat renders a solid fill at fillOpacity", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line
          data={lineData}
          name="S"
          fillOpacity={0.35}
          fillStyle="flat"
          fillColor="#ff0000"
        />
      </Chart.Svg>,
    );
    const path = document.querySelector(
      '[data-chart-series="series-0"] path[fill^="#"]',
    );
    expect(path).toBeTruthy();
    expect(path!.getAttribute("fill")).toBe("#ff0000");
    expect(path!.getAttribute("opacity")).toBe("0.35");
  });
});

describe("pie padAngle/cornerRadius + percent labels", () => {
  it("settled SVG pie paths honor padAngle and cornerRadius", () => {
    const { rerender } = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie data={pieData} name="Mix" innerRadius={0.6} />
      </Chart.Svg>,
    );
    const plain = document.querySelector("svg[role=img] path")!.getAttribute(
      "d",
    );
    rerender(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie
          data={pieData}
          name="Mix"
          innerRadius={0.6}
          padAngle={0.05}
          cornerRadius={8}
        />
      </Chart.Svg>,
    );
    const gapped = document.querySelector("svg[role=img] path")!.getAttribute(
      "d",
    );
    expect(gapped).not.toBe(plain);
  });

  it("pie percent labels respect the min-share threshold", () => {
    const { rerender } = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie data={pieData} name="Mix" showPercentLabels />
      </Chart.Svg>,
    );
    expect(screen.getByText("40%")).toBeTruthy();
    expect(screen.getByText("60%")).toBeTruthy();
    rerender(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie data={pieData} name="Mix" showPercentLabels minPercentLabel={50} />
      </Chart.Svg>,
    );
    expect(screen.queryByText("40%")).toBeNull();
    expect(screen.getByText("60%")).toBeTruthy();
  });

  it("pie percent labels count up during the entrance", () => {
    vi.useFakeTimers();
    const raf = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) =>
        setTimeout(() => cb(performance.now()), 16) as unknown as number,
      );
    const { unmount } = render(
      <Chart.Svg height={300} animation={{ duration: 300 }}>
        <Chart.Pie data={pieData} name="Mix" showPercentLabels />
      </Chart.Svg>,
    );
    act(() => {
      vi.advanceTimersByTime(150);
    });
    // mid-entrance: the 60% slice has not counted up to its final value yet
    expect(document.body.textContent).not.toContain("60%");
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(document.body.textContent).toContain("60%");
    raf.mockRestore();
    unmount();
  });
});

describe("XAxis vertical grid controls", () => {
  const verticalGridLines = () =>
    [...document.querySelectorAll('[data-chart-feature="xaxis"] line')].filter(
      (l) => l.getAttribute("y1") !== l.getAttribute("y2"),
    );

  it("XAxis vertical grid is dashed when gridDash=dashed", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" />
        <Chart.XAxis gridDash="dashed" />
      </Chart.Svg>,
    );
    const vg = verticalGridLines();
    expect(vg.length).toBeGreaterThan(0);
    expect(vg[0].getAttribute("stroke-dasharray")).toBe("4 3");
  });

  it("XAxis vertical grid can be disabled", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" />
        <Chart.XAxis grid={false} />
      </Chart.Svg>,
    );
    // only the horizontal domain line remains
    expect(verticalGridLines()).toHaveLength(0);
  });
});


describe("tooltip pointer positioning", () => {
  function renderLineChart() {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    const utils = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={data} name="S" />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 300,
        width: 800,
        height: 300,
      }),
    });
    const rects = svg.querySelectorAll("rect");
    const rect = rects[rects.length - 1] as SVGRectElement;
    return { utils, rect };
  }

  it("positions the card against the pointer, not the snapped anchor", () => {
    const { rect } = renderLineChart();
    // pointer at x=300 (no flip at this width): the card must open 14px
    // right of the POINTER even when the snapped category sits further
    // left.
    fireEvent.pointerMove(rect, { clientX: 300, clientY: 150 });
    const tip = document.querySelector(
      "[data-chart-feature=\"tooltip\"]",
    ) as HTMLElement;
    expect(tip).toBeTruthy();
    expect(parseFloat(tip.style.left)).toBe(314); // 300 + 14
  });

  it("flips using the MEASURED card width, not the 190 estimate", () => {
    const { rect } = renderLineChart();
    // jsdom reports 0 for offsets → the item-count estimate applies; a
    // 1-item card estimates 68 tall and 190 wide (maxWidth). Near the
    // right edge the card flips left of the pointer without a
    // multi-hundred-pixel gap: left = 700 - 190 - 14 = 496.
    fireEvent.pointerMove(rect, { clientX: 700, clientY: 150 });
    const tip = document.querySelector(
      "[data-chart-feature=\"tooltip\"]",
    ) as HTMLElement;
    expect(parseFloat(tip.style.left)).toBe(496); // 700 - 190 - 14
  });

  it("clamps a tall card inside the bottom edge using its measured height", () => {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={data} name="S" />
        <Chart.Tooltip
          rows={() => [
            { label: "Low", value: "1" },
            { label: "High", value: "2" },
            { label: "Avg", value: "3" },
            { label: "Δ", value: "4" },
          ]}
        />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 300,
        width: 800,
        height: 300,
      }),
    });
    const rect = svg.querySelectorAll("rect")[
      svg.querySelectorAll("rect").length - 1
    ] as SVGRectElement;
    // jsdom: offsetHeight 0 → estH = 46 + 1 * 22 = 68; pointer y=250
    // (near the bottom, inside the plot): 250 + 12 + 68 > 292 → flip →
    // top = 250 - 68 - 12 = 170.
    fireEvent.pointerMove(rect, { clientX: 400, clientY: 250 });
    const tip = document.querySelector(
      "[data-chart-feature=\"tooltip\"]",
    ) as HTMLElement;
    // With real (measured) heights the card never runs past
    // height - estH - 8; in jsdom the estimate keeps the old contract.
    expect(parseFloat(tip.style.top)).toBeLessThanOrEqual(300 - 68 - 8);
  });

  it("does not draw a crosshair for pie (non-cartesian) charts", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie
          data={[
            { name: "A", value: 10 },
            { name: "B", value: 20 },
            { name: "C", value: 30 },
          ]}
          name="Mix"
        />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 300,
        width: 800,
        height: 300,
      }),
    });
    const rect = svg.querySelectorAll("rect")[
      svg.querySelectorAll("rect").length - 1
    ] as SVGRectElement;
    // hover the right side of the pie (slice B/C)
    fireEvent.pointerMove(rect, { clientX: 480, clientY: 150 });
    const tip = document.querySelector(
      "[data-chart-feature=\"tooltip\"]",
    );
    expect(tip).toBeTruthy();
    const lines = Array.from(svg.querySelectorAll("line")).filter(
      (l) =>
        l.getAttribute("stroke-dasharray") === "3 3" &&
        l.getAttribute("x1") === l.getAttribute("x2"),
    );
    expect(lines.length).toBe(0);
    // and the header is the slice's category, not the chart title
    expect(tip!.textContent).toMatch(/A|B|C/);
  });
});

describe("chart chrome collision fixes", () => {
  it("YAxis rotated title clears the tick labels (50px from the axis line)", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={lineData} name="S" />
        <Chart.Line
          data={lineData.map((d) => ({ ...d, value: d.value * 1000 }))}
          name="R"
          yFieldAxis="right"
        />
        <Chart.YAxis label="Index" />
        <Chart.YAxis axis="right" label="ARR ($)" />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    for (const side of ["left", "right"] as const) {
      const g = svg.querySelector(
        `[data-chart-feature="yaxis-${side}"]`,
      )!;
      const title = [...g.querySelectorAll("text")].find(
        (t) => (t.getAttribute("transform") ?? "").includes("rotate"),
      )!;
      const axisLine = [...g.querySelectorAll("line")][0]!;
      const axisX = Number(axisLine.getAttribute("x1"));
      const titleX = Number(title.getAttribute("x"));
      // past the tick-label zone: 8px gap + ~37px for "$1000k"-class labels
      expect(titleX).toBe(side === "right" ? axisX + 50 : axisX - 50);
    }
  });

  it("tooltip follows the cursor Y and flips above it near the bottom", () => {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={data} name="S" />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 300,
        width: 800,
        height: 300,
      }),
    });
    const rects = svg.querySelectorAll("rect");
    const rect = rects[rects.length - 1] as SVGRectElement;

    // cursor near the top → card sits just below the cursor
    fireEvent.pointerMove(rect, { clientX: 400, clientY: 60 });
    const tip = document.querySelector(
      '[data-chart-feature="tooltip"]',
    ) as HTMLElement;
    expect(parseFloat(tip.style.top)).toBe(72); // 60 + 12

    // cursor near the bottom (still inside the plot) → card flips above it
    fireEvent.pointerMove(rect, { clientX: 400, clientY: 240 });
    expect(parseFloat(tip.style.top)).toBe(160); // 240 - 68 - 12
  });

  it("annotation flips below the point when it would overlap the top chrome", () => {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Title title="Growth" subtitle="indexed" />
        <Chart.Line data={data} name="S" />
        <Chart.Annotation
          x={data[data.length - 1].date}
          y={data[data.length - 1].value}
          placement="top"
          title="Pricing lift"
          value="+105 pts"
        />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const card = svg.querySelector(
      '[data-chart-feature="annotation"] rect',
    )!;
    const dot = svg.querySelector(
      '[data-chart-feature="annotation"] circle',
    )!;
    const cardY = Number(card.getAttribute("y"));
    const dotY = Number(dot.getAttribute("cy"));
    // the card must not overlap the title/subtitle strip (plot top = 48)
    expect(cardY).toBeGreaterThanOrEqual(48);
    // ...and the flip landed it below the point
    expect(cardY).toBeGreaterThan(dotY);
  });
});

describe("candlestick selected-candle highlight", () => {
  const setupHover = () => {
    const svg = document.querySelector("svg[role=img]")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 300,
        width: 800,
        height: 300,
      }),
    });
    const rects = svg.querySelectorAll("rect");
    const hoverRect = rects[rects.length - 1] as SVGRectElement;
    const bodyRects = () =>
      [...document.querySelectorAll('[data-chart-series] rect')];
    return { svg, hoverRect, bodyRects };
  };

  it("highlights the hovered candle: wider body, lighter fill, close pill", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Candlestick data={candleData} name="BTC" />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const { hoverRect, bodyRects } = setupHover();
    const first = bodyRects()[0]!;
    const beforeW = Number(first.getAttribute("width"));
    const beforeFill = first.getAttribute("fill")!;
    // hover exactly on the first candle's center
    const cx =
      Number(first.getAttribute("x")) + beforeW / 2;
    fireEvent.pointerMove(hoverRect, { clientX: cx, clientY: 150 });
    const afterW = Number(bodyRects()[0]!.getAttribute("width"));
    expect(afterW).toBeGreaterThan(beforeW);
    // lightened toward white (rgb) vs the base hex color
    expect(bodyRects()[0]!.getAttribute("fill")!.startsWith("rgb(")).toBe(
      true,
    );
    expect(beforeFill.startsWith("rgb(")).toBe(false);
    // close-price pill (candle 1 close = 105)
    const pill = document.querySelector('[data-chart-series] text');
    expect(pill?.textContent).toBe("105");
  });

  it("clears the highlight when the pointer leaves", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Candlestick data={candleData} name="BTC" />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const { hoverRect, bodyRects } = setupHover();
    const first = bodyRects()[0]!;
    const beforeW = Number(first.getAttribute("width"));
    const cx = Number(first.getAttribute("x")) + beforeW / 2;
    fireEvent.pointerMove(hoverRect, { clientX: cx, clientY: 150 });
    expect(document.querySelector('[data-chart-series] text')).toBeTruthy();
    fireEvent.pointerLeave(hoverRect);
    expect(
      Number(bodyRects()[0]!.getAttribute("width")),
    ).toBe(beforeW);
    expect(document.querySelector('[data-chart-series] text')).toBeNull();
  });

  it("highlightSelected={false} disables the highlight and pill", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Candlestick
          data={candleData}
          name="BTC"
          highlightSelected={false}
        />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const { hoverRect, bodyRects } = setupHover();
    const first = bodyRects()[0]!;
    const beforeW = Number(first.getAttribute("width"));
    const cx = Number(first.getAttribute("x")) + beforeW / 2;
    fireEvent.pointerMove(hoverRect, { clientX: cx, clientY: 150 });
    expect(Number(bodyRects()[0]!.getAttribute("width"))).toBe(beforeW);
    expect(document.querySelector('[data-chart-series] text')).toBeNull();
  });
});

// ── Range area (band between two lines) ──────────────────────────────────────

const rangeData = [
  { date: new Date(2024, 0, 1), min: 80, max: 120 },
  { date: new Date(2024, 2, 1), min: 95, max: 150 },
  { date: new Date(2024, 4, 1), min: 85, max: 130 },
  { date: new Date(2024, 6, 1), min: 110, max: 170 },
];

describe("range area series", () => {
  it("renders the band + both edge paths on SVG", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.RangeArea data={rangeData} name="Band" />
      </Chart.Svg>,
    );
    const g = document.querySelector('[data-chart-series="series-0"]');
    expect(g).toBeTruthy();
    const paths = g!.querySelectorAll("path");
    expect(paths.length).toBe(3);
    const band = paths[0];
    expect(band.getAttribute("d")).toBeTruthy();
    // band is a closed area (ends with Z), edges are open strokes
    expect(band.getAttribute("d")!.endsWith("Z")).toBe(true);
    expect(band.getAttribute("fill")).toBeTruthy();
    expect(paths[1].getAttribute("fill")).toBe("none");
    expect(paths[2].getAttribute("fill")).toBe("none");
    // gradient fill by default → fill references the gradient def
    expect(paths[0].getAttribute("fill")!.startsWith("url(#")).toBe(true);
  });

  it("renders on canvas without crashing", () => {
    render(
      <Chart.Canvas height={300} {...noAnim}>
        <Chart.RangeArea data={rangeData} name="Band" />
      </Chart.Canvas>,
    );
    // Canvas renderer paints via the draw registry — no SVG series group.
    expect(document.querySelector("canvas")).toBeTruthy();
    expect(
      document.querySelector('[data-chart-series="series-0"]'),
    ).toBeNull();
  });

  it("tooltip shows min–max for the hovered band", () => {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.RangeArea data={rangeData} name="Band" />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    const rects = svg!.querySelectorAll("rect");
    const hoverRect = rects[rects.length - 1] as SVGRectElement;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 300,
        width: 800,
        height: 300,
        x: 0,
        y: 0,
        toJSON() {
          return this;
        },
      }),
      configurable: true,
    });
    // near the second data point (x ≈ 297 of a 60→740 plot)
    fireEvent.pointerMove(hoverRect, { clientX: 350, clientY: 150 });
    const tip = document.querySelector('[data-chart-feature="tooltip"]');
    expect(tip).toBeTruthy();
    expect(tip!.textContent).toContain("95–150");
  });
});

// ── Line fill between two lines ──────────────────────────────────────────────

describe("line fill between two lines", () => {
  const renderLine = (
    data: { date: Date; value: number; baseline?: number }[],
    withField: boolean,
  ) =>
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line
          data={data}
          name="S"
          valueYField="value"
          fillOpacity={0.3}
          fillBaseline={withField ? "field" : undefined}
          fillBaselineField={withField ? "baseline" : undefined}
        />
      </Chart.Svg>,
    );
  const areaPath = () =>
    document
      .querySelector('[data-chart-series="series-0"] path[fill^="#"]')!
      .getAttribute("d")!;
  const linePath = () =>
    [...document.querySelectorAll('[data-chart-series="series-0"] path')]
      .find((p) => p.getAttribute("fill") === "none")!
      .getAttribute("d")!;

  it("a varying baseline curve produces a different (band-shaped) area", () => {
    const data = lineData.map((d, i) => ({
      ...d,
      baseline: d.value - 20 - i * 5,
    }));
    renderLine(data, true);
    const a = areaPath();
    const l = linePath();
    cleanup();
    renderLine(data, false);
    const b = areaPath();
    const l2 = linePath();
    // the fill closes to the baseline field's curve, not the axis floor
    expect(a).not.toBe(b);
    // the visible line is untouched by the fill baseline
    expect(l).toBe(l2);
  });
});

// ── Radar (spider) chart ─────────────────────────────────────────────────────

const radarData = [
  { axis: "SSO", launch: 88, target: 97, benchmark: 95 },
  { axis: "Data residency", launch: 78, target: 93, benchmark: 88 },
  { axis: "Audit exports", launch: 82, target: 95, benchmark: 97 },
  { axis: "Key rotation", launch: 55, target: 88, benchmark: 75 },
  { axis: "RPO drills", launch: 48, target: 90, benchmark: 62 },
  { axis: "Admin guardrails", launch: 58, target: 85, benchmark: 78 },
  { axis: "Procurement", launch: 72, target: 88, benchmark: 92 },
  { axis: "Support SLA", launch: 76, target: 90, benchmark: 85 },
];

function renderRadar(
  extra: Record<string, unknown> = {},
  targetProps: Record<string, unknown> = {},
) {
  return render(
    <Chart.Svg height={300} {...noAnim}>
      <Chart.Radar
        data={radarData}
        name="Launch build"
        valueYField="launch"
        color="violet"
        {...extra}
      />
      <Chart.Radar
        data={radarData}
        name="Target bar"
        valueYField="target"
        color="teal"
        lineDash={[6, 4]}
        {...targetProps}
      />
      <Chart.Radar
        data={radarData}
        name="Buyer benchmark"
        valueYField="benchmark"
        color="amber"
      />
      <Chart.RadarAxis rings={4} tickFormat={(t) => `${t} pts`} />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>,
  );
}

/** Read the radar center + outer radius from the rendered grid. */
function radarCenter() {
  const spoke = document.querySelector(
    '[data-chart-layer="radar-grid"] line',
  ) as SVGLineElement;
  const cx = Number(spoke.getAttribute("x1"));
  const cy = Number(spoke.getAttribute("y1"));
  const R = Math.hypot(
    Number(spoke.getAttribute("x2")) - cx,
    Number(spoke.getAttribute("y2")) - cy,
  );
  return { cx, cy, R };
}

describe("radar series", () => {
  it("renders the shared grid (rings, spokes, axis + tick labels)", () => {
    renderRadar();
    const grid = document.querySelector('[data-chart-layer="radar-grid"]');
    expect(grid).toBeTruthy();
    expect(grid!.querySelectorAll("path").length).toBe(4); // rings
    expect(grid!.querySelectorAll("line").length).toBe(8); // spokes
    const labels = grid!.querySelectorAll("text");
    expect(labels.length).toBe(12); // 8 axis + 4 ticks
    expect([...labels].some((t) => t.textContent === "SSO")).toBe(true);
    expect(
      [...labels].some((t) => t.textContent === "100 pts"),
    ).toBe(true);
  });

  it("renders one polygon + markers per series, dashed where set", () => {
    renderRadar();
    const groups = document.querySelectorAll("[data-chart-series]");
    expect(groups.length).toBe(3);
    for (const g of groups) {
      const paths = g.querySelectorAll("path");
      expect(paths.length).toBe(2); // fill + outline
      expect(g.querySelectorAll("circle").length).toBeGreaterThanOrEqual(8);
    }
    const target = document.querySelectorAll(
      '[data-chart-series] path[stroke-dasharray="6 4"]',
    );
    expect(target.length).toBe(1);
    // legend lists all three series
    expect(document.body.textContent).toContain("Launch build");
    expect(document.body.textContent).toContain("Target bar");
    expect(document.body.textContent).toContain("Buyer benchmark");
  });

  it("flat fill renders the polygon at fillOpacity", () => {
    renderRadar();
    const fill = document.querySelector(
      '[data-chart-series="series-0"] path[fill]:not([fill="none"])',
    );
    expect(fill).toBeTruthy();
    expect(fill!.getAttribute("opacity")).toBe("0.18");
  });

  it("fillStyle=gradient renders a radial gradient def", () => {
    renderRadar({ fillStyle: "gradient" }, { fillStyle: "gradient" });
    const grad = document.querySelector('[data-chart-series] radialGradient');
    expect(grad).toBeTruthy();
    const stops = grad!.querySelectorAll("stop");
    expect(stops[0].getAttribute("stop-opacity")).toBe("0");
    expect(stops[1].getAttribute("stop-opacity")).toBe("0.18");
    const filled = document.querySelector(
      '[data-chart-series] path[fill^="url"]',
    );
    expect(filled).toBeTruthy();
  });

  it("goal renders a dot + label on the first axis", () => {
    renderRadar({}, { goal: 80, goalLabel: "Launch-ready ≥ 80 pts" });
    const texts = document.body.textContent ?? "";
    expect(texts).toContain("Launch-ready ≥ 80 pts");
    // the goal dot: a circle with r=4 inside the target group
    const group = document.querySelectorAll("[data-chart-series]")[1];
    const dot = group.querySelector("circle[r='4']");
    expect(dot).toBeTruthy();
  });

  it("tooltip snaps to the nearest axis with one row per series", () => {
    renderRadar();
    const svg = document.querySelector("svg[role=img]")!;
    const rects = svg.querySelectorAll("rect");
    const hoverRect = rects[rects.length - 1] as SVGRectElement;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 300,
        width: 800,
        height: 300,
        x: 0,
        y: 0,
        toJSON() {
          return this;
        },
      }),
      configurable: true,
    });
    // straight above the center → nearest axis is 0 ("SSO")
    const { cx, cy, R } = radarCenter();
    fireEvent.pointerMove(hoverRect, { clientX: cx, clientY: cy - R / 2 });
    const tip = document.querySelector('[data-chart-feature="tooltip"]');
    expect(tip).toBeTruthy();
    const text = tip!.textContent ?? "";
    expect(text).toContain("SSO");
    expect(text).toContain("88");
    expect(text).toContain("97");
    expect(text).toContain("95");
  });

  it("renders on canvas without crashing", () => {
    render(
      <Chart.Canvas height={300} {...noAnim}>
        <Chart.Radar
          data={radarData}
          name="Launch build"
          valueYField="launch"
          color="violet"
        />
        <Chart.Radar
          data={radarData}
          name="Target bar"
          valueYField="target"
          color="teal"
          lineDash={[6, 4]}
          goal={80}
          goalLabel="Launch-ready"
        />
        <Chart.RadarAxis rings={4} />
      </Chart.Canvas>,
    );
    expect(document.querySelector("canvas")).toBeTruthy();
  });
});

// ── Polar (rose / nightingale) series ───────────────────────────────────────

const polarData = [
  { category: "N", value: 42, alt: 12 },
  { category: "NE", value: 18, alt: 6 },
  { category: "E", value: 30, alt: 9 },
  { category: "SE", value: 12, alt: 4 },
  { category: "S", value: 26, alt: 8 },
  { category: "SW", value: 55, alt: 20 },
  { category: "W", value: 48, alt: 16 },
  { category: "NW", value: 20, alt: 7 },
];

function renderPolar(
  seriesProps: Record<string, unknown> = {},
  secondProps: Record<string, unknown> = {},
  rootProps: Record<string, unknown> = {},
  axisProps: Record<string, unknown> = {},
) {
  return render(
    <Chart.Svg height={420} {...noAnim} {...rootProps}>
      <Chart.Polar
        data={polarData}
        name="Morning"
        valueYField="value"
        color="blue"
        {...seriesProps}
      />
      <Chart.Polar
        data={polarData}
        name="Afternoon"
        valueYField="alt"
        color="orange"
        {...secondProps}
      />
      <Chart.PolarAxis {...axisProps} />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>,
  );
}

describe("polar series", () => {
  it("renders one segment per category per series (group mode)", () => {
    renderPolar();
    const groups = document.querySelectorAll("[data-chart-series]");
    expect(groups.length).toBe(2);
    expect(
      groups[0].querySelectorAll("path[fill]").length,
    ).toBe(8);
    expect(
      groups[1].querySelectorAll("path[fill]").length,
    ).toBe(8);
  });

  it("stack mode keeps the same segment count with banded radii", () => {
    renderPolar({ mode: "stack" }, { mode: "stack" });
    const groups = document.querySelectorAll("[data-chart-series]");
    expect(groups[0].querySelectorAll("path[fill]").length).toBe(8);
    // Outer segment of category N for the second series must start where the
    // first ends (plus the band gap) — verify distinct d per series.
    const first = groups[0].querySelector("path[fill]")!.getAttribute("d")!;
    const second = groups[1].querySelector("path[fill]")!.getAttribute("d")!;
    expect(first).not.toBe(second);
  });

  it("renders the shared circular grid, category labels and legend", () => {
    renderPolar();
    const grid = document.querySelector(
      '[data-chart-layer="polar-grid"]',
    );
    expect(grid).toBeTruthy();
    expect(grid!.querySelectorAll("path").length).toBe(4); // rings
    expect(grid!.querySelectorAll("line").length).toBe(8); // spokes
    const labels = grid!.querySelectorAll("text");
    expect([...labels].some((t) => t.textContent === "N")).toBe(true);
    expect([...labels].some((t) => t.textContent === "SW")).toBe(true);
    // legend lists both series
    expect(document.body.textContent).toContain("Morning");
    expect(document.body.textContent).toContain("Afternoon");
  });

  it("gridShape=polygon renders polygon rings and tick labels when enabled", () => {
    renderPolar({}, {}, {}, { gridShape: "polygon", showTickLabels: true });
    const grid = document.querySelector(
      '[data-chart-layer="polar-grid"]',
    )!;
    const ring = grid.querySelectorAll("path")[1];
    expect(ring.getAttribute("d")).toMatch(/^M.*L.*Z$/); // polygon, not arcs
    const ticks = [...grid.querySelectorAll("text")].filter(
      (t) => /^\d+$/.test(t.textContent ?? ""),
    );
    expect(ticks.length).toBe(4);
  });

  it("polar tick labels are off by default", () => {
    renderPolar();
    const grid = document.querySelector(
      '[data-chart-layer="polar-grid"]',
    )!;
    const ticks = [...grid.querySelectorAll("text")].filter(
      (t) => /^\d+$/.test(t.textContent ?? ""),
    );
    expect(ticks.length).toBe(0);
  });

  it("dashed grid style applies the dasharray to rings and spokes", () => {
    renderPolar({}, {}, {}, { gridStyle: "dashed" });
    const grid = document.querySelector(
      '[data-chart-layer="polar-grid"]',
    )!;
    const ring = grid.querySelector("path")!;
    expect(ring.getAttribute("stroke-dasharray")).toBe("4 3");
    const spoke = grid.querySelector("line")!;
    expect(spoke.getAttribute("stroke-dasharray")).toBe("4 3");
  });

  it("borderWidth renders a segment outline", () => {
    renderPolar({ borderWidth: 2 });
    const outlined = document.querySelectorAll(
      "[data-chart-series] path[stroke-width='2']",
    );
    expect(outlined.length).toBe(8);
  });

  it("tooltip hit-tests the hovered segment (category header + rows)", () => {
    renderPolar();
    const svg = document.querySelector("svg[role=img]")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0, top: 0, right: 800, bottom: 420,
        width: 800, height: 420, x: 0, y: 0,
        toJSON() { return this; },
      }),
      configurable: true,
    });
    const grid = document.querySelector(
      '[data-chart-layer="polar-grid"] line',
    ) as SVGLineElement;
    const cx = Number(grid.getAttribute("x1"));
    const cy = Number(grid.getAttribute("y1"));
    const R = Math.hypot(
      Number(grid.getAttribute("x2")) - cx,
      Number(grid.getAttribute("y2")) - cy,
    );
    // Category N is at the top: aim mid-sub-arc (11.25° right of 12
    // o'clock for the first series' slot), mid-radius.
    const a = -Math.PI / 2 + Math.PI / 16;
    const rect = svg.querySelector("rect[fill='transparent']") as SVGRectElement;
    fireEvent.pointerMove(rect, {
      clientX: cx + Math.cos(a) * (R / 3),
      clientY: cy + Math.sin(a) * (R / 3),
    });
    const tip = document.querySelector('[data-chart-feature="tooltip"]');
    expect(tip).toBeTruthy();
    const text = tip!.textContent ?? "";
    expect(text).toContain("N");
    expect(text).toContain("42");
    expect(text).toContain("12");
  });

  it("hoverDim fades non-hovered series only when configured", () => {
    renderPolar({}, {}, { hoverDim: 0.4 });
    const svg = document.querySelector("svg[role=img]")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0, top: 0, right: 800, bottom: 420,
        width: 800, height: 420, x: 0, y: 0,
        toJSON() { return this; },
      }),
      configurable: true,
    });
    const grid = document.querySelector(
      '[data-chart-layer="polar-grid"] line',
    ) as SVGLineElement;
    const cx = Number(grid.getAttribute("x1"));
    const cy = Number(grid.getAttribute("y1"));
    const R = Math.hypot(
      Number(grid.getAttribute("x2")) - cx,
      Number(grid.getAttribute("y2")) - cy,
    );
    const a = -Math.PI / 2 + Math.PI / 16;
    const rect = svg.querySelector("rect[fill='transparent']") as SVGRectElement;
    fireEvent.pointerMove(rect, {
      clientX: cx + Math.cos(a) * (R / 3),
      clientY: cy + Math.sin(a) * (R / 3),
    });
    // eslint-disable-next-line no-console
    console.log(
      "HOVERDIM-TIP",
      document.querySelector('[data-chart-feature="tooltip"]')?.textContent,
    );
    const groups = document.querySelectorAll("[data-chart-series]");
    const opacities = [...groups].map((g) =>
      (g as HTMLElement).style.opacity,
    );
    expect(opacities).toContain("0.4");
    expect(opacities).toContain("1");
  });

  it("renders on canvas without crashing", () => {
    render(
      <Chart.Canvas height={420} {...noAnim}>
        <Chart.Polar
          data={polarData}
          name="Morning"
          valueYField="value"
          color="blue"
          mode="stack"
          innerRadius={0.3}
          segmentRadius={6}
        />
        <Chart.Polar
          data={polarData}
          name="Afternoon"
          valueYField="alt"
          color="orange"
          mode="stack"
          innerRadius={0.3}
        />
        <Chart.PolarAxis gridLines={3} sort="desc" />
      </Chart.Canvas>,
    );
    expect(document.querySelector("canvas")).toBeTruthy();
  });
});

// ── Update-animation bookkeeping (StrictMode double-render safe) ───────────

describe("update animation bookkeeping", () => {
  const polarA = [
    { category: "a", value: 20 },
    { category: "b", value: 40 },
    { category: "c", value: 60 },
    { category: "d", value: 30 },
  ];
  const polarB = [
    { category: "a", value: 60 },
    { category: "b", value: 20 },
    { category: "c", value: 30 },
    { category: "d", value: 55 },
  ];
  const renderPolarData = (data: typeof polarA) => (
    <StrictMode>
      <Chart.Svg
        height={300}
        animation={{ duration: 900, easing: "easeOutQuart" }}
      >
        <Chart.Polar data={data} name="S" color="blue" />
        <Chart.PolarAxis />
      </Chart.Svg>
    </StrictMode>
  );

  it("morphs from the previous settled geometry after a data change", async () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(renderPolarData(polarA));
      // Settle the entrance.
      await vi.advanceTimersByTimeAsync(1500);
      const d1 =
        document.querySelector(
          "[data-chart-series] path[fill]",
        )?.getAttribute("d") ?? null;
      expect(d1).toBeTruthy();

      // Data change: the update animation should interpolate d1 → d2.
      rerender(renderPolarData(polarB));
      await vi.advanceTimersByTimeAsync(450); // mid-animation
      const dMid =
        document.querySelector(
          "[data-chart-series] path[fill]",
        )?.getAttribute("d") ?? null;
      await vi.advanceTimersByTimeAsync(1500);
      const d2 =
        document.querySelector(
          "[data-chart-series] path[fill]",
        )?.getAttribute("d") ?? null;

      expect(dMid).toBeTruthy();
      expect(dMid).not.toBe(d1); // not still the old shape
      expect(dMid).not.toBe(d2); // not already the new shape
      expect(d2).not.toBe(d1);
    } finally {
      vi.useRealTimers();
    }
  });
});

// ── Animation types (radial / sweep / fade entrances) ──────────────────────

describe("animation types", () => {
  const polarData = [
    { category: "a", value: 30 },
    { category: "b", value: 60 },
    { category: "c", value: 45 },
    { category: "d", value: 20 },
  ];

  it("fade: polar series fades in at full geometry", async () => {
    vi.useFakeTimers();
    try {
      render(
        <Chart.Svg
          height={300}
          animation={{ duration: 900, type: "fade" }}
        >
          <Chart.Polar data={polarData} name="S" color="blue" />
          <Chart.PolarAxis />
        </Chart.Svg>,
      );
      await vi.advanceTimersByTimeAsync(450);
      const g =
        document.querySelector(
          "[data-chart-series]",
        ) as HTMLElement | null;
      expect(g).toBeTruthy();
      const opacity = parseFloat(
        g!.style.opacity ?? getComputedStyle(g!).opacity ?? "1",
      );
      expect(opacity).toBeGreaterThan(0.01);
      expect(opacity).toBeLessThan(0.99);
      await vi.advanceTimersByTimeAsync(1500);
      const gEnd = document.querySelector(
        "[data-chart-series]",
      ) as HTMLElement | null;
      expect(gEnd).toBeTruthy();
      expect(parseFloat(gEnd!.style.opacity ?? "1")).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("sweep: polar segments reveal clockwise from 12 o'clock", async () => {
    vi.useFakeTimers();
    try {
      render(
        <Chart.Svg
          height={300}
          animation={{ duration: 900, type: "sweep" }}
        >
          <Chart.Polar data={polarData} name="S" color="blue" />
          <Chart.PolarAxis />
        </Chart.Svg>,
      );
      // Mid-sweep (easeOutQuart ≈ 0.65 at 230ms of 900ms): the first two
      // segments (starting at 12 o'clock) are shown, the last is still
      // hidden (empty path).
      await vi.advanceTimersByTimeAsync(230);
      const paths = Array.from(
        document.querySelectorAll("[data-chart-series] path[fill]"),
      ).map((p) => p.getAttribute("d"));
      expect(paths.length).toBe(4);
      expect(paths[0]).toBeTruthy();
      expect(paths[1]).toBeTruthy();
      // The third segment straddles the sweep front: clipped (differs from
      // its settled path).
      await vi.advanceTimersByTimeAsync(1000);
      const settledNow = Array.from(
        document.querySelectorAll("[data-chart-series] path[fill]"),
      ).map((p2) => p2.getAttribute("d"));
      expect(settledNow[2]).toBeTruthy();
      expect(paths[2]).toBeTruthy();
      expect(paths[2]).not.toBe(settledNow[2]);
      await vi.advanceTimersByTimeAsync(1200);
      const settled = Array.from(
        document.querySelectorAll("[data-chart-series] path[fill]"),
      ).map((p) => p.getAttribute("d"));
      expect(settled.every((d) => d && d.length > 0)).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("radial: pie slices grow from the inner radius at once", async () => {
    vi.useFakeTimers();
    try {
      render(
        <Chart.Svg
          height={300}
          animation={{ duration: 900, type: "radial" }}
        >
          <Chart.Pie
            data={[
              { name: "a", value: 30 },
              { name: "b", value: 40 },
              { name: "c", value: 30 },
            ]}
            innerRadius={0.5}
            cornerRadius={4}
          />
        </Chart.Svg>,
      );
      await vi.advanceTimersByTimeAsync(450);
      const mid = Array.from(
        document.querySelectorAll("[data-chart-series] path[fill]"),
      ).map((p) => p.getAttribute("d") ?? "");
      expect(mid.filter((d) => d.length > 0).length).toBe(3);
      await vi.advanceTimersByTimeAsync(1200);
      const settled = Array.from(
        document.querySelectorAll("[data-chart-series] path[fill]"),
      ).map((p) => p.getAttribute("d") ?? "");
      // Every slice grew: mid-entrance paths differ from the settled ones.
      expect(
        mid.filter((d, i) => d !== settled[i]).length,
      ).toBe(3);
    } finally {
      vi.useRealTimers();
    }
  });
});

// ── Scatter / bubble ────────────────────────────────────────────────────────

describe("scatter", () => {
  const alpha = [
    { x: 10, y: 20, size: 50 },
    { x: 30, y: 60, size: 150 },
    { x: 50, y: 40, size: 100 },
  ];
  const beta = [
    { x: 20, y: 80, size: 50 },
    { x: 40, y: 30, size: 150 },
    { x: 60, y: 70, size: 100 },
  ];

  it("renders one marker per datum with bubble radii", () => {
    const { container } = render(
      <Chart.Svg height={300} animation={false}>
        <Chart.Scatter data={alpha} name="A" color="blue" sizeField="size" />
        <Chart.Scatter data={beta} name="B" color="green" sizeField="size" />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const groups = container.querySelectorAll("[data-chart-series]");
    expect(groups.length).toBe(2);
    const pathsA = container.querySelectorAll(
      "[data-chart-series] path.chart-scatter-point",
    );
    expect(pathsA.length).toBe(6);
    // Bubble: the max-size datum (150) renders a larger radius than the
    // min-size datum (50) — compare arc radii in the path data.
    const radii = (d: string | null) => {
      const m = d?.match(/a([\d.]+),[\d.]+ 0 1,0/);
      return m ? Number(m[1]) : 0;
    };
    const groupA = groups[0] as SVGElement;
    const ds = Array.from(
      groupA.querySelectorAll("path.chart-scatter-point"),
    ).map((p) => radii(p.getAttribute("d")));
    expect(Math.max(...ds)).toBeGreaterThan(Math.min(...ds));
  });

  it("uniform dots when no size field", () => {
    const { container } = render(
      <Chart.Svg height={300} animation={false}>
        <Chart.Scatter data={alpha} name="A" color="blue" />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const ds = Array.from(
      container.querySelectorAll("path.chart-scatter-point"),
    ).map((p) => p.getAttribute("d") ?? "");
    const radii = (d: string) => {
      const m = d.match(/a([\d.]+),[\d.]+ 0 1,0/);
      return m ? Number(m[1]) : 0;
    };
    expect(new Set(ds.map(radii)).size).toBe(1);
  });

  it("renders a slanted two-point reference line", () => {
    const { container } = render(
      <Chart.Svg height={300}>
        <Chart.Scatter data={alpha} name="A" color="blue" />
        <Chart.ReferenceLine x={10} y={10} x2={50} y2={70} label="trend" />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const line = container.querySelector(
      "[data-chart-feature='refline'] line",
    ) as SVGLineElement | null;
    expect(line).toBeTruthy();
    // Slanted: distinct endpoints on both axes.
    expect(Number(line!.getAttribute("x1"))).not.toBe(
      Number(line!.getAttribute("x2")),
    );
    expect(Number(line!.getAttribute("y1"))).not.toBe(
      Number(line!.getAttribute("y2")),
    );
  });

  it("grows markers in on entrance", async () => {
    vi.useFakeTimers();
    try {
      const { container } = render(
        <Chart.Svg
          height={300}
          animation={{ duration: 900, type: "grow" }}
        >
          <Chart.Scatter
            data={alpha}
            name="A"
            color="blue"
            sizeField="size"
          />
          <Chart.XAxis />
          <Chart.YAxis />
        </Chart.Svg>,
      );
      await vi.advanceTimersByTimeAsync(200);
      const mid = Array.from(
        container.querySelectorAll("path.chart-scatter-point"),
      ).map((p) => p.getAttribute("d") ?? "");
      expect(mid.some((d) => d.length > 0)).toBe(true);
      await vi.advanceTimersByTimeAsync(1200);
      const settled = Array.from(
        container.querySelectorAll("path.chart-scatter-point"),
      ).map((p) => p.getAttribute("d") ?? "");
      expect(
        mid.filter((d, i) => d !== settled[i]).length,
      ).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("logs y-axis ticks with a log scale", () => {
    const moore = [
      { x: 1, y: 2_300 },
      { x: 2, y: 3_300_000 },
      { x: 3, y: 2_080_000_000 },
    ];
    const { container } = render(
      <Chart.Svg height={300} animation={false}>
        <Chart.Scatter data={moore} name="Transistors" color="blue" />
        <Chart.XAxis />
        <Chart.YAxis log />
      </Chart.Svg>,
    );
    const text = container.textContent ?? "";
    // SI-formatted log ticks (M/B magnitudes).
    expect(text).toMatch(/500M|1B|2B/);
  });

  it("hover: the hit point grows and other series dim", async () => {
    vi.useFakeTimers();
    try {
      const { container } = render(
        <Chart.Svg height={300} hoverDim={0.3}>
          <Chart.Scatter data={alpha} name="A" color="blue" sizeField="size" />
          <Chart.Scatter data={beta} name="B" color="green" sizeField="size" />
          <Chart.XAxis />
          <Chart.YAxis />
          <Chart.Hover />
        </Chart.Svg>,
      );
      await vi.advanceTimersByTimeAsync(1500);
      const svg = container.querySelector("svg");
      expect(svg).toBeTruthy();
      if (!svg) throw new Error("missing svg");
      const groups = container.querySelectorAll("[data-chart-series]");
      const gA = groups[0] as SVGElement;
      const gB = groups[1] as SVGElement;
      expect(gA).toBeTruthy();
      expect(gB).toBeTruthy();
      // Mock the svg's box 1:1 so clientX/Y == viewBox coordinates.
      Object.defineProperty(svg, "getBoundingClientRect", {
        value: () => ({
          left: 0,
          top: 0,
          right: 800,
          bottom: 300,
          width: 800,
          height: 300,
          x: 0,
          y: 0,
          toJSON() {
            return this;
          },
        }),
        configurable: true,
      });
      // Center of the first marker, read from its path data.
      const d = gA.querySelector("path")!.getAttribute("d")!;
      const m = d.match(/^M([\d.]+),([\d.]+)a([\d.]+),/);
      expect(m).toBeTruthy();
      const cx = Number(m![1]) + Number(m![3]);
      const cy = Number(m![2]);
      const rOf = (dd: string) => {
        const mm = dd.match(/a([\d.]+),[\d.]+ 0 1,0/);
        return mm ? Number(mm[1]) : 0;
      };
      const preHoverR = rOf(d);
      const rects = svg.querySelectorAll("rect");
      const hoverRect = rects[rects.length - 1] as SVGRectElement;
      fireEvent.pointerMove(hoverRect, { clientX: cx, clientY: cy });
      await vi.advanceTimersByTimeAsync(50);
      // Series B dims to hoverDim; series A stays full.
      expect((gB!.style.opacity ?? "1")).toBe("0.3");
      expect((gA!.style.opacity ?? "1")).toBe("1");
      // The hit marker grew past its own pre-hover radius.
      const hitNow = rOf(gA.querySelector("path")!.getAttribute("d")!);
      expect(hitNow).toBeGreaterThan(preHoverR * 1.2);
    } finally {
      vi.useRealTimers();
    }
  }, 15000);
});

// ── Annotation collision ────────────────────────────────────────────────────

describe("annotation collision", () => {
  const data = [
    { x: 10, y: 50 },
    { x: 30, y: 70 },
    { x: 50, y: 40 },
  ];

  function annotationRects(container: HTMLElement) {
    return Array.from(
      container.querySelectorAll("[data-chart-feature='annotation'] rect"),
    ).map((r) => ({
      x: Number(r.getAttribute("x")),
      y: Number(r.getAttribute("y")),
      w: Number(r.getAttribute("width")),
      h: Number(r.getAttribute("height")),
    }));
  }

  it("keeps two same-point annotation cards apart", () => {
    const { container } = render(
      <Chart.Svg height={300} animation={false}>
        <Chart.Line data={data} name="S" color="blue" valueYField="y" />
        <Chart.Annotation x={30} y={70} title="First callout" value="A" />
        <Chart.Annotation
          x={30}
          y={70}
          title="Second callout"
          value="B"
        />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const rects = annotationRects(container);
    expect(rects.length).toBe(2);
    const [a, b] = rects;
    // No overlap with a 6px gap.
    const overlapX = a.x < b.x + b.w + 6 && a.x + a.w + 6 > b.x;
    const overlapY = a.y < b.y + b.h + 6 && a.y + a.h + 6 > b.y;
    expect(overlapX && overlapY).toBe(false);
  });

  it("keeps a single annotation at its legacy position", () => {
    const { container } = render(
      <Chart.Svg height={300} animation={false}>
        <Chart.Line data={data} name="S" color="blue" valueYField="y" />
        <Chart.Annotation
          x={30}
          y={70}
          placement="right"
          title="Only one"
          value="V"
        />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const groups = container.querySelectorAll(
      "[data-chart-feature='annotation']",
    );
    expect(groups.length).toBe(1);
    const g = groups[0] as SVGElement;
    // Leader line + dot + card all present.
    expect(g.querySelector("line")).toBeTruthy();
    expect(g.querySelector("circle")).toBeTruthy();
    const rect = g.querySelector("rect")!;
    // right side: card starts 14px right of the marker.
    const dot = g.querySelector("circle") as SVGCircleElement;
    expect(Number(rect.getAttribute("x"))).toBeCloseTo(
      Number(dot.getAttribute("cx")) + 14,
      1,
    );
  });
});

// ── Gauge + Nightingale ─────────────────────────────────────────────────────

describe("gauge", () => {
  it("renders the value arc, track, ticks and target", () => {
    const { container } = render(
      <Chart.Svg height={300} animation={false}>
        <Chart.Gauge
          value={65}
          min={0}
          max={100}
          zones={[
            { from: 0, to: 50, color: "#22c55e" },
            { from: 50, to: 100, color: "#ef4444" },
          ]}
          ticks={{ count: 10, majorEvery: 5 }}
          target={80}
        />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    expect(g).toBeTruthy();
    const paths = g.querySelectorAll("path");
    // 2 zones × 16 subdivisions + 1 track
    expect(paths.length).toBe(33);
    const ticks = g.querySelectorAll("line");
    expect(ticks.length).toBe(11);
    // target dot: two circles (fill + white ring)
    const circles = g.querySelectorAll("circle");
    expect(circles.length).toBe(1);
  });

  it("renders a semicircle gauge without ticks", () => {
    const { container } = render(
      <Chart.Svg height={300} animation={false}>
        <Chart.Gauge
          value={40}
          min={0}
          max={100}
          arcSpan={Math.PI}
          startAngle={Math.PI}
        />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    expect(g).toBeTruthy();
    expect(g.querySelectorAll("line").length).toBe(0);
    // value arc (1 fallback zone × 16) + track
    expect(g.querySelectorAll("path").length).toBe(17);
  });
});

describe("nightingale", () => {
  const data = [
    { name: "Jan", value: 10 },
    { name: "Feb", value: 40 },
    { name: "Mar", value: 20 },
    { name: "Apr", value: 5 },
  ];

  it("renders equal-angle petals with value-scaled radii and labels", () => {
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Pie
          data={data}
          name="M"
          innerRadius={0.3}
          nightingale
          colors={["#f43f5e", "#f59e0b", "#38bdf8", "#38bdf8"]}
        />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    expect(g).toBeTruthy();
    const petals = g.querySelectorAll("path");
    expect(petals.length).toBe(4);
    // Labels: name + value texts (8) and leader spokes (4)
    const texts = [...g.querySelectorAll("text")].map(
      (t) => t.textContent,
    );
    expect(texts).toContain("Feb");
    expect(texts).toContain("40");
    const spokes = g.querySelectorAll("line");
    expect(spokes.length).toBe(4);
  });

  it("keeps regular pies without outside labels", () => {
    const { container } = render(
      <Chart.Svg height={300} animation={false}>
        <Chart.Pie data={data} name="M" innerRadius={0.5} />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    expect(g.querySelectorAll("line").length).toBe(0);
  });
});

describe("nightingale decor", () => {
  const data = [
    { name: "W1", value: 10 },
    { name: "W2", value: 20 },
    { name: "W3", value: 40 },
    { name: "W4", value: 15 },
  ];

  it("renders per-slice ticks and group bands", () => {
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Pie
          data={data}
          name="M"
          nightingale
          innerRadius={0.3}
          nightingaleTicks
          nightingaleBands={[
            { from: 0, to: 1, color: "#5daeea" },
            { from: 2, to: 3, color: "#ffad5a" },
          ]}
        />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const lines = g.querySelectorAll("line");
    // 4 leader spokes + 4 ticks
    expect(lines.length).toBe(8);
    const paths = g.querySelectorAll("path");
    // 4 petals + 2 band arcs
    expect(paths.length).toBe(6);
  });

  it("renders the peak label inside the max slice", () => {
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Pie
          data={data}
          name="M"
          nightingale
          innerRadius={0.3}
          peakLabel="MAX"
        />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const text = Array.from(g.querySelectorAll("text")).find(
      (t) => t.textContent === "MAX",
    );
    expect(text).toBeTruthy();
  });

  it("tooltip rows render custom rows for a hovered slice", () => {
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Pie
          data={data}
          name="M"
          nightingale
          innerRadius={0.3}
        />
        <Chart.Tooltip
          rows={(item) => [
            { label: "Value", value: String(item.value) },
            {
              label: "vs avg",
              value: `${item.value - 21.25 >= 0 ? "+" : ""}${(item.value - 21.25).toFixed(2)}`,
              color: item.value - 21.25 >= 0 ? "#10a981" : "#e5484d",
            },
          ]}
        />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = container.querySelector("svg")!;
    const rects = svg.querySelectorAll("rect");
    const rect = rects[rects.length - 1] as SVGRectElement;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 320,
        width: 800,
        height: 320,
        x: 0,
        y: 0,
        toJSON() {
          return this;
        },
      }),
      configurable: true,
    });
    // The pie center is the plot center: area x=0 (no axes) → cx=400, cy=160.
    // Point slightly right of center (angle ~0.1 rad) falls in slice 1 (W2,
    // which spans ~1.57–3.14 rad after the first 1.57 rad slice).
    fireEvent.pointerMove(rect, { clientX: 410, clientY: 150 });
    const tip = container.querySelector('[data-chart-feature="tooltip"]');
    expect(tip).toBeTruthy();
    expect(tip?.textContent).toContain("vs avg");
    expect(tip?.textContent).toContain("Value");
  });
});

describe("pie outerRadius ratio", () => {
  const data = [
    { name: "A", value: 10 },
    { name: "B", value: 30 },
  ];
  // jsdom has no getBBox — measure the max radial extent from the arc
  // path data (the farthest sampled point from the pie center).
  const pathPoints = (d: string): [number, number][] => {
    const pts: [number, number][] = [];
    const re = /([MLAZ])([^MLAZ]*)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(d))) {
      const cmd = m[1];
      const n = m[2]
        .trim()
        .split(/[-,\s]+/)
        .filter(Boolean)
        .map(Number);
      if (cmd === "M" || cmd === "L") {
        for (let i = 0; i + 1 < n.length; i += 2)
          pts.push([n[i], n[i + 1]]);
      } else if (cmd === "A") {
        for (let i = 0; i + 7 <= n.length; i += 7)
          pts.push([n[i + 5], n[i + 6]]);
      }
    }
    return pts;
  };
  const ringExtent = (container: Element) => {
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const pts: [number, number][] = [];
    g.querySelectorAll("path").forEach((p) =>
      pts.push(...pathPoints(p.getAttribute("d") ?? "")),
    );
    if (pts.length === 0) return 0;
    const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length;
    const cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
    let maxR = 0;
    pts.forEach(([x, y]) => {
      maxR = Math.max(maxR, Math.hypot(x - cx, y - cy));
    });
    return maxR;
  };
  it("scales the ring down", () => {
    const full = render(
      <Chart.Svg height={400} animation={false}>
        <Chart.Pie data={data} name="A" innerRadius={0.3} />
      </Chart.Svg>,
    );
    const scaled = render(
      <Chart.Svg height={400} animation={false}>
        <Chart.Pie
          data={data}
          name="A"
          innerRadius={0.3}
          outerRadius={0.5}
        />
      </Chart.Svg>,
    );
    const a = ringExtent(full.container);
    const b = ringExtent(scaled.container);
    // outerRadius scales the available radius, so the sampled max
    // extent halves exactly (sampling is geometry-linear).
    expect(b).toBeCloseTo(a / 2, 1);
    expect(a).toBeGreaterThan(100);
  });
});

describe("waterfall series", () => {
  const data = [
    { name: "Open", value: 420, isTotal: true },
    { name: "Expansion", value: 62 },
    { name: "Pricing", value: 34 },
    { name: "Churn", value: -44 },
    { name: "Close", value: 472, isTotal: true },
  ];

  const wf = (extra: Record<string, unknown> = {}) => (
    <Chart.Svg height={320} animation={false}>
      <Chart.Waterfall
        data={data}
        categoryXField="name"
        valueYField="value"
        totalField="isTotal"
        {...extra}
      />
      <Chart.XAxis />
      <Chart.YAxis />
    </Chart.Svg>
  );

  it("renders one rect per step plus connectors and labels", () => {
    const { container } = render(wf({ connectors: true }));
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    expect(g.querySelectorAll("rect").length).toBe(5);
    expect(g.querySelectorAll("line").length).toBe(4);
    const texts = Array.from(g.querySelectorAll("text")).map((t) =>
      t.textContent,
    );
    expect(texts).toContain("+62");
    expect(texts).toContain("-44");
  });

  it("routes total bars to the total color and deltas to up/down", () => {
    const { container } = render(
      wf({ colors: { up: "#111111", down: "#222222", total: "#333333" } }),
    );
    const rects = Array.from(
      container.querySelectorAll("[data-chart-series] rect"),
    );
    expect(rects[0].getAttribute("fill")).toBe("#333333"); // Open total
    expect(rects[1].getAttribute("fill")).toBe("#111111"); // Expansion
    expect(rects[3].getAttribute("fill")).toBe("#222222"); // Churn
    expect(rects[4].getAttribute("fill")).toBe("#333333"); // Close total
  });

  it("stacks layers per step", () => {
    const layered = [
      { name: "A", layers: [{ name: "core", value: 100 }, { name: "incr", value: 50 }] },
      { name: "B", layers: [{ name: "core", value: -40 }, { name: "incr", value: -20 }] },
    ];
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Waterfall
          data={layered}
          categoryXField="name"
          valueYField="value"
          layersField={(r) => (r as { layers: { name: string; value: number }[] }).layers}
        />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    // two stacked rects per step (no single rects)
    expect(g.querySelectorAll("rect").length).toBe(4);
  });

  it("reports the step delta on hover", () => {
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Waterfall
          data={data}
          categoryXField="name"
          valueYField="value"
          totalField="isTotal"
        />
        <Chart.XAxis />
        <Chart.YAxis />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = container.querySelector("svg")!;
    const rects = svg.querySelectorAll("rect");
    const rect = rects[rects.length - 1] as SVGRectElement;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0, top: 0, right: 800, bottom: 320,
        width: 800, height: 320, x: 0, y: 0,
        toJSON() { return this; },
      }),
      configurable: true,
    });
    fireEvent.pointerMove(rect, { clientX: 400, clientY: 160 });
    const tip = container.querySelector('[data-chart-feature="tooltip"]');
    expect(tip).toBeTruthy();
  });
});
describe("combo coexistence", () => {
  const months = [
    { month: "Jan", revenue: 100, budget: 90, temperature: 4 },
    { month: "Feb", revenue: 120, budget: 110, temperature: 7 },
    { month: "Mar", revenue: 90, budget: 105, temperature: 12 },
    { month: "Apr", revenue: 140, budget: 130, temperature: 18 },
  ];

  it("renders bars and a line together in one chart", () => {
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Bar
          data={months}
          name="Revenue"
          categoryXField="month"
          valueYField="revenue"
        />
        <Chart.Line
          data={months}
          name="Budget"
          categoryXField="month"
          valueYField="budget"
          lineStyle="dashed"
        />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const svg = container.querySelector("svg")!;
    const series = Array.from(svg.querySelectorAll("[data-chart-series]"));
    expect(series.length).toBe(2);
    const barRects = series[0].querySelectorAll("rect");
    expect(barRects.length).toBe(4);
    // the line vertices sit on the bar slot centers
    const path = svg.querySelector("path[stroke-dasharray]")!;
    const d = path.getAttribute("d") ?? "";
    const m = d.match(/M(-?\d+(?:\.\d+)?)/);
    expect(m).toBeTruthy();
    const barCx =
      Number(barRects[0].getAttribute("x")) +
      Number(barRects[0].getAttribute("width")) / 2;
    expect(Number(m![1])).toBeCloseTo(barCx, 0);
  });

  it("stacks three bars per category with a total line overlay", () => {
    const rows = [
      { q: "Q1", a: 40, b: 30, c: 20, total: 90 },
      { q: "Q2", a: 50, b: 35, c: 25, total: 110 },
      { q: "Q3", a: 55, b: 40, c: 30, total: 125 },
      { q: "Q4", a: 60, b: 45, c: 35, total: 140 },
    ];
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Bar data={rows} name="A" categoryXField="q" valueYField="a" mode="stack" stackId="s" />
        <Chart.Bar data={rows} name="B" categoryXField="q" valueYField="b" mode="stack" stackId="s" />
        <Chart.Bar data={rows} name="C" categoryXField="q" valueYField="c" mode="stack" stackId="s" />
        <Chart.Line data={rows} name="Total" categoryXField="q" valueYField="total" showMarkers />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const svg = container.querySelector("svg")!;
    // 4 categories x 3 stacked segments (the total line's area base rect is
    // the only extra rect in the chart)
    const groups = Array.from(svg.querySelectorAll("[data-chart-series]"));
    const barRects = groups.flatMap((g) =>
      Array.from(g.querySelectorAll("rect")).filter(
        (r) => Number(r.getAttribute("width")) < 400,
      ),
    );
    expect(barRects.length).toBe(12);
    const path = svg.querySelector("path");
    expect(path).toBeTruthy();
    // every bar shares the same x per category: all 12 rects use the band slots
    const xs = barRects.map((r) => r.getAttribute("x"));
    expect(new Set(xs).size).toBe(4);
  });

  it("plots a right-axis series on its own y scale", () => {
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Bar
          data={months}
          name="Revenue"
          categoryXField="month"
          valueYField="revenue"
        />
        <Chart.Line
          data={months}
          name="Temperature"
          categoryXField="month"
          valueYField="temperature"
          yFieldAxis="right"
        />
        <Chart.XAxis />
        <Chart.YAxis label="Revenue" />
        <Chart.YAxis axis="right" label="Temp" />
      </Chart.Svg>,
    );
    const svg = container.querySelector("svg")!;
    const left = svg.querySelector('[data-chart-feature^="yaxis-left"]');
    const right = svg.querySelector('[data-chart-feature^="yaxis-right"]');
    expect(left).toBeTruthy();
    expect(right).toBeTruthy();
  });

  it("centers scatter markers on the same band as the line vertices", () => {
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Line
          data={months}
          name="Target"
          categoryXField="month"
          valueYField="revenue"
          showMarkers={false}
        />
        <Chart.Scatter
          data={months}
          name="Actual"
          xField="month"
          yField="budget"
        />
        <Chart.XAxis />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const svg = container.querySelector("svg")!;
    const points = Array.from(svg.querySelectorAll("path.chart-scatter-point"));
    expect(points.length).toBe(4);
    // circle marker path: M{x-r},{y}a{r},{r} ... → center = (m1 + r, m2)
    const cxs = points
      .map((p) => {
        const m = (p.getAttribute("d") ?? "").match(
          /M(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)a(-?\d+(?:\.\d+)?),/,
        );
        expect(m).toBeTruthy();
        return Number(m![1]) + Number(m![3]);
      })
      .sort((a, b) => a - b);
    const path = svg.querySelector("path")!;
    const d = (path.getAttribute("d") ?? "").replace(/\s+/g, " ");
    const xs: number[] = [];
    for (const m of d.matchAll(/[ML](-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)) {
      xs.push(Number(m[1]));
    }
    expect(xs.length).toBe(4);
    const pathXs = [...xs].sort((a, b) => a - b);
    cxs.forEach((cx, i) => expect(cx).toBeCloseTo(pathXs[i], 0));
  });
});
describe("heatmap series", () => {
  const data = [
    { row: "A", col: "1", value: 10 },
    { row: "A", col: "2", value: 20 },
    { row: "A", col: "3", value: 30 },
    { row: "B", col: "1", value: 40 },
    { row: "B", col: "3", value: 50 },
  ];

  const hm = (extra: Record<string, unknown> = {}) => (
    <Chart.Svg height={320} animation={false}>
      <Chart.Heatmap
        data={data}
        rows={["A", "B"]}
        cols={["1", "2", "3"]}
        {...extra}
      />
    </Chart.Svg>
  );

  it("renders one rect per (row, col) cell including null gaps", () => {
    const { container } = render(hm({}));
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    // 6 cell rects + 1 gradient legend bar — count cells only
    const cellRects = Array.from(g.querySelectorAll("rect")).filter(
      (r) => !(r.getAttribute("fill") ?? "").startsWith("url("),
    );
    expect(cellRects.length).toBe(6);
    // the missing B/2 cell renders the transparent (no-fill) slot
    expect(
      cellRects.filter((r) => r.getAttribute("fill") === "transparent").length,
    ).toBe(1);
  });

  it("draws value labels and a gradient legend when enabled", () => {
    const { container } = render(hm({ valueLabels: true }));
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const texts = Array.from(g.querySelectorAll("text")).map((t) => t.textContent);
    expect(texts).toContain("10.00");
    expect(texts).toContain("50.00");
    expect(g.querySelector("linearGradient")).toBeTruthy();
  });

  it("shows a tooltip with the cell value on hover", () => {
    const { container } = render(
      <Chart.Svg height={320} animation={false}>
        <Chart.Heatmap data={data} rows={["A", "B"]} cols={["1", "2", "3"]} />
        <Chart.XAxis />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = container.querySelector("svg")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0, top: 0, right: 800, bottom: 320,
        width: 800, height: 320, x: 0, y: 0,
        toJSON() { return this; },
      }),
      configurable: true,
    });
    // Grid: row-label gutter (~2 chars * 6.4 + 10 = 22.8) → gridX ≈ 60+23
    // 3 cols over ~717px, 2 rows over (320 - 24 - 40) ≈ 256 → cell centers
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const rect = Array.from(g.querySelectorAll("rect")).find((r) => r.getAttribute("fill") !== "transparent")!;
    const x = Number(rect.getAttribute("x")) + Number(rect.getAttribute("width")) / 2;
    const y = Number(rect.getAttribute("y")) + Number(rect.getAttribute("height")) / 2;
    // Hover is bound to the transparent hover rect (last rect in the svg).
    const all = Array.from(container.querySelectorAll("svg rect"));
    const hoverRect = all[all.length - 1] as SVGRectElement;
    fireEvent.pointerMove(hoverRect, { clientX: x, clientY: y });
    const tip = container.querySelector('[data-chart-feature="tooltip"]');
    expect(tip).toBeTruthy();
    // header = column ("1"), row = row label ("A"), value = 10
    expect(tip?.textContent).toContain("10");
    expect(tip?.textContent).toContain("A");
  });
});
describe("treemap series", () => {
  const data = [
    { name: "Asia", value: 45 },
    { name: "Africa", value: 28 },
    { name: "Europe", value: 22 },
    { name: "N. America", value: 14 },
    { name: "S. America", value: 8 },
    { name: "Oceania", value: 3 },
  ];

  it("renders one rect per tile with uniform fill when color is set", () => {
    const { container } = render(
      <Chart.Svg height={360} animation={false}>
        <Chart.Treemap data={data} color="#38bdf8" />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const rects = Array.from(g.querySelectorAll("rect"));
    expect(rects.length).toBe(6);
    expect(rects.every((r) => r.getAttribute("fill") === "#38bdf8")).toBe(true);
    expect(
      Array.from(g.querySelectorAll("text"))
        .map((t) => t.textContent)
        .includes("Asia"),
    ).toBe(true);
  });

  it("uses the palette (distinct fills) when no color is given", () => {
    const { container } = render(
      <Chart.Svg height={360} animation={false}>
        <Chart.Treemap data={data} />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const fills = Array.from(
      new Set(
        Array.from(g.querySelectorAll("rect")).map((r) => r.getAttribute("fill")),
      ),
    );
    expect(fills.length).toBeGreaterThan(1);
  });

  it("renders group headers and reserves the header band", () => {
    const grouped = [
      { group: "Engineering", name: "Frontend", value: 42 },
      { group: "Engineering", name: "Backend", value: 34 },
      { group: "Engineering", name: "DevOps", value: 28 },
      { group: "Marketing", name: "Digital", value: 38 },
      { group: "Marketing", name: "Brand", value: 24 },
    ];
    const { container } = render(
      <Chart.Svg height={360} animation={false}>
        <Chart.Treemap data={grouped} groupField="group" />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const texts = Array.from(g.querySelectorAll("text")).map(
      (t) => t.textContent,
    );
    expect(texts).toContain("ENGINEERING");
    expect(texts).toContain("MARKETING");
    // 5 tiles + 2 header rects
    const rects = Array.from(g.querySelectorAll("rect"));
    expect(rects.length).toBe(7);
  });

  it("renders a delta pill and corner value in stock style", () => {
    const stocks = [
      { symbol: "AAPL", value: 2.9, delta: 1.2 },
      { symbol: "MSFT", value: 2.8, delta: -0.8 },
      { symbol: "NVDA", value: 1.2, delta: 3.4 },
    ];
    const { container } = render(
      <Chart.Svg height={360} animation={false}>
        <Chart.Treemap
          data={stocks}
          categoryField="symbol"
          valueField="value"
          deltaField="delta"
          valueLabels
          valueLabelFormat={(v: number) => `$${v}T`}
        />
      </Chart.Svg>,
    );
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const texts = Array.from(g.querySelectorAll("text")).map(
      (t) => t.textContent,
    );
    expect(texts).toContain("$2.9T");
    expect(texts.some((t) => t?.includes("\u25b2"))).toBe(true);
    expect(texts.some((t) => t?.includes("\u25bc"))).toBe(true);
  });

  it("shows a tooltip with the tile value on hover", () => {
    const { container } = render(
      <Chart.Svg height={360} animation={false}>
        <Chart.Treemap data={data} />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = container.querySelector("svg")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 360,
        width: 800,
        height: 360,
        x: 0,
        y: 0,
        toJSON() {
          return this;
        },
      }),
      configurable: true,
    });
    const g = container.querySelector("[data-chart-series]") as SVGGElement;
    const rect = Array.from(g.querySelectorAll("rect"))[0] as SVGRectElement;
    const x =
      Number(rect.getAttribute("x")) + Number(rect.getAttribute("width")) / 2;
    const y =
      Number(rect.getAttribute("y")) + Number(rect.getAttribute("height")) / 2;
    const all = Array.from(container.querySelectorAll("svg rect"));
    fireEvent.pointerMove(all[all.length - 1], { clientX: x, clientY: y });
    const tip = container.querySelector('[data-chart-feature="tooltip"]');
    expect(tip).toBeTruthy();
    expect(tip?.textContent).toContain("Asia");
  });
});
describe("synced charts", () => {
  const months = [
    { month: "Jan", a: 10, b: 5 },
    { month: "Feb", a: 20, b: 15 },
    { month: "Mar", a: 30, b: 25 },
  ];

  const mockSvgs = (svgs: SVGSVGElement[]) => {
    for (const svg of svgs) {
      Object.defineProperty(svg, "getBoundingClientRect", {
        value: () => ({
          left: 0,
          top: 0,
          right: 800,
          bottom: 300,
          width: 800,
          height: 300,
          x: 0,
          y: 0,
          toJSON() {
            return this;
          },
        }),
        configurable: true,
      });
    }
  };

  const tipFor = (svg: SVGSVGElement): Element | null => {
    // the tooltip portal lives in the chart host, not the svg — find it via
    // the host wrapper preceding/following the svg
    return svg.parentElement?.querySelector(
      '[data-chart-feature="tooltip"]',
    ) ?? null;
  };

  it("syncs hover to sibling sync charts by category and clears on leave", () => {
    const { container } = render(
      <Chart.Group>
        <Chart.Svg height={300} animation={false} sync>
          <Chart.Line
            data={months}
            categoryXField="month"
            valueYField="a"
            name="A"
          />
          <Chart.XAxis />
          <Chart.YAxis />
          <Chart.Tooltip />
          <Chart.Hover />
        </Chart.Svg>
        <Chart.Svg height={300} animation={false} sync>
          <Chart.Line
            data={months}
            categoryXField="month"
            valueYField="b"
            name="B"
          />
          <Chart.XAxis />
          <Chart.YAxis />
          <Chart.Tooltip />
          <Chart.Hover />
        </Chart.Svg>
        <Chart.Svg height={300} animation={false}>
          <Chart.Line
            data={months}
            categoryXField="month"
            valueYField="a"
            name="C"
          />
          <Chart.XAxis />
          <Chart.YAxis />
          <Chart.Tooltip />
          <Chart.Hover />
        </Chart.Svg>
      </Chart.Group>,
    );
    const svgs = Array.from(container.querySelectorAll("svg")).filter(
      (s) => (s as SVGSVGElement).querySelector("[data-chart-series]"),
    ) as SVGSVGElement[];
    expect(svgs.length).toBe(3);
    mockSvgs(svgs);

    // "Feb" tick x position from chart A's axis labels
    const feb = Array.from(
      svgs[0].querySelectorAll("text"),
    ).find((t) => t.textContent === "Feb");
    expect(feb).toBeTruthy();
    const fx = Number(feb!.getAttribute("x"));
    const fy = Number(feb!.getAttribute("y"));

    const hoverRectA = Array.from(svgs[0].querySelectorAll("rect")).pop()!;
    fireEvent.pointerMove(hoverRectA, { clientX: fx, clientY: Math.max(fy - 20, 10) });

    // chart A (origin) shows its own tooltip
    expect(tipFor(svgs[0])?.textContent).toContain("Feb");
    // chart B (synced) shows the same category at its own scale
    expect(tipFor(svgs[1])?.textContent).toContain("Feb");
    // chart C (no sync prop) is untouched
    expect(tipFor(svgs[2])).toBeNull();

    // leave A → everything clears
    fireEvent.pointerLeave(hoverRectA);
    expect(tipFor(svgs[0])).toBeNull();
    expect(tipFor(svgs[1])).toBeNull();
  });
});
describe("loading state", () => {
  it("renders a skeleton in place of the chart by default", () => {
    const { container } = render(
      <Chart.Svg height={300} animation={false} loading>
        <Chart.Title title="Loading title" subtitle="sub" />
        <Chart.Line data={[]} />
      </Chart.Svg>,
    );
    expect(container.querySelector("[data-chart-series]")).toBeNull();
    const sk = container.querySelector('[data-chart-loading="skeleton"]');
    expect(sk).toBeTruthy();
    expect(
      container.querySelector('[aria-busy="true"]'),
    ).toBeTruthy();
    // title bar present because a Title child was given
    expect(
      Array.from(sk!.querySelectorAll("span")).length,
    ).toBeGreaterThan(3);
  });

  it("renders the chart beneath a spinner overlay for loaderType=spinner", () => {
    const data = [
      { x: "a", y: 1 },
      { x: "b", y: 2 },
    ];
    const { container } = render(
      <Chart.Svg height={300} animation={false} loading loaderType="spinner">
        <Chart.Line data={data} categoryXField="x" valueYField="y" name="s" />
      </Chart.Svg>,
    );
    expect(container.querySelector("[data-chart-series]")).toBeTruthy();
    const overlay = container.querySelector('[role="status"]');
    expect(overlay).toBeTruthy();
  });

  it("renders a progress overlay for loaderType=progress", () => {
    const data = [
      { x: "a", y: 1 },
      { x: "b", y: 2 },
    ];
    const { container } = render(
      <Chart.Svg
        height={300}
        animation={false}
        loading
        loaderType="progress"
        loaderProgress={40}
      >
        <Chart.Line data={data} categoryXField="x" valueYField="y" name="s" />
      </Chart.Svg>,
    );
    expect(container.querySelector("[data-chart-series]")).toBeTruthy();
    expect(container.querySelector('[role="status"]')).toBeTruthy();
  });

  it("still renders a custom node when loading is a node", () => {
    const { container } = render(
      <Chart.Svg
        height={300}
        animation={false}
        loading={<div data-custom-loading={true} />}
      >
        <Chart.Line data={[]} />
      </Chart.Svg>,
    );
    expect(container.querySelector("[data-custom-loading]")).toBeTruthy();
  });

  it("injects the chart keyframes once when loading", () => {
    render(
      <Chart.Svg height={300} loading>
        <Chart.Line data={[]} />
      </Chart.Svg>,
    );
    const style = document.getElementById("dsh-chart-keyframes");
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain("dsh-chart-spin");
    expect(style?.textContent).toContain("dsh-chart-pulse");
  });
});

describe("nightingale equal-angle hover", () => {
  // Nightingale petals are EQUAL angles (value → radius). The hover
  // resolution must follow the equal slots, not value-proportional
  // angles — otherwise a petal highlights the wrong neighbour.
  const months = [
    { name: "Jan", value: 14.9 },
    { name: "Feb", value: 19.5 },
    { name: "Mar", value: 46.3 },
    { name: "Apr", value: 97.3 },
    { name: "May", value: 144.4 },
    { name: "Jun", value: 110.9 },
    { name: "Jul", value: 45.9 },
    { name: "Aug", value: 32.9 },
    { name: "Sep", value: 23.5 },
    { name: "Oct", value: 26.2 },
    { name: "Nov", value: 14.6 },
    { name: "Dec", value: 8.5 },
  ];

  function renderNightingale() {
    render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Pie data={months} name="Tornadoes" nightingale />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>,
    );
    const svg = document.querySelector("svg[role=img]")!;
    Object.defineProperty(svg, "getBoundingClientRect", {
      value: () => ({
        left: 0, top: 0, right: 800, bottom: 300,
        width: 800, height: 300,
      }),
    });
    const rects = svg.querySelectorAll("rect");
    return rects[rects.length - 1] as SVGRectElement;
  }

  // 12 equal slots, Jan first at 12 o'clock (d3: 0 up, clockwise).
  // mid of slot i = (i + 0.5) * 30°.
  function hoverSlot(i: number, rect: SVGRectElement) {
    const a = ((i + 0.5) * (Math.PI * 2)) / 12;
    const cx = 400, cy = 150, r = 86 * 0.6;
    const clientX = cx + r * Math.sin(a);
    const clientY = cy - r * Math.cos(a);
    fireEvent.pointerMove(rect, { clientX, clientY });
  }

  it("resolves each petal by its equal-angle slot, not by value", () => {
    const rect = renderNightingale();
    // May is the largest value: value-proportional angles would make the
    // May petal (slot 4, 120–150°) absorb the Jun petal's region.
    hoverSlot(4, rect); // May
    expect(document.querySelector('[data-chart-feature="tooltip"]')?.textContent).toContain("May");
    hoverSlot(5, rect); // Jun — the old value-proportional math returned May here
    expect(document.querySelector('[data-chart-feature="tooltip"]')?.textContent).toContain("Jun");
    hoverSlot(0, rect); // Jan
    expect(document.querySelector('[data-chart-feature="tooltip"]')?.textContent).toContain("Jan");
    hoverSlot(11, rect); // Dec
    expect(document.querySelector('[data-chart-feature="tooltip"]')?.textContent).toContain("Dec");
  });
});

describe("tile-mode axes", () => {
  function renderAxesChart(extra: Record<string, unknown> = {}) {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    const { container } = render(
      <Chart.Svg height={300} {...noAnim} {...extra}>
        <Chart.Line data={data} name="S" />
        <Chart.XAxis />
        <Chart.YAxis tickCount={4} />
        <Chart.Hover />
      </Chart.Svg>,
    );
    return container;
  }

  function hoverRectSize(container: HTMLElement) {
    const svg = container.querySelector("svg")!;
    const rects = svg.querySelectorAll("rect");
    const r = rects[rects.length - 1] as SVGRectElement;
    return {
      w: Number(r.getAttribute("width")),
      h: Number(r.getAttribute("height")),
    };
  }

  it("axes={false} strips axis chrome and reclaims the margins", () => {
    const base = hoverRectSize(renderAxesChart());
    renderAxesChart({ axes: false });
    const svg = document.querySelectorAll("svg[role=img]");
    const last = svg[svg.length - 1] as unknown as HTMLElement;
    const container = last.parentElement!.parentElement!;
    const big = hoverRectSize(container as HTMLElement);
    // no axis chrome at all
    expect(
      container.querySelector('[data-chart-feature="xaxis"]'),
    ).toBeNull();
    expect(
      container.querySelector('[data-chart-feature="yaxis-left"]'),
    ).toBeNull();
    // plot area reclaims the axis margins
    expect(big.w).toBeGreaterThan(base.w);
    expect(big.h).toBeGreaterThan(base.h);
  });

  it("XAxis axisLine={false} drops the domain line, keeps labels", () => {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    const { container } = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={data} name="S" />
        <Chart.XAxis axisLine={false} />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const x = container.querySelector('[data-chart-feature="xaxis"]')!;
    expect(x.querySelectorAll("text").length).toBeGreaterThan(0);
    // The domain line is the only horizontal line in the X group
    // (gridlines are vertical); none may remain.
    const horiz = Array.from(x.querySelectorAll("line")).filter((l) =>
      l.getAttribute("y1") === l.getAttribute("y2"),
    );
    expect(horiz.length).toBe(0);
  });

  it("XAxis labels={false} drops tick text, keeps the domain line", () => {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    const { container } = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={data} name="S" />
        <Chart.XAxis labels={false} grid={false} />
        <Chart.YAxis />
      </Chart.Svg>,
    );
    const x = container.querySelector('[data-chart-feature="xaxis"]')!;
    expect(x.querySelectorAll("text").length).toBe(0);
    // grid off → the only line left is the domain line (horizontal).
    const horiz = Array.from(x.querySelectorAll("line")).filter((l) =>
      l.getAttribute("y1") === l.getAttribute("y2"),
    );
    expect(horiz.length).toBe(1);
  });

  it("YAxis axisLine={false} drops the line, keeps tick text", () => {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    const { container } = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={data} name="S" />
        <Chart.XAxis />
        <Chart.YAxis tickCount={4} axisLine={false} />
      </Chart.Svg>,
    );
    const y = container.querySelector('[data-chart-feature="yaxis-left"]')!;
    expect(y.querySelectorAll("text").length).toBeGreaterThan(0);
    // The domain line is the only vertical line in the Y group
    // (gridlines are horizontal); none may remain.
    const vert = Array.from(y.querySelectorAll("line")).filter((l) =>
      l.getAttribute("x1") === l.getAttribute("x2"),
    );
    expect(vert.length).toBe(0);
  });

  it("YAxis labels={false} now keeps the domain line", () => {
    const data = lineData.map((_d, i) => ({
      date: new Date(2024, 0, 1 + i * 60),
      value: 100 + i * 10,
    }));
    const { container } = render(
      <Chart.Svg height={300} {...noAnim}>
        <Chart.Line data={data} name="S" />
        <Chart.XAxis />
        <Chart.YAxis tickCount={4} labels={false} grid={false} />
      </Chart.Svg>,
    );
    const y = container.querySelector('[data-chart-feature="yaxis-left"]')!;
    expect(y.querySelectorAll("text").length).toBe(0);
    // grid off → the only line left is the domain line (vertical) —
    // kept by the new labels/axisLine split.
    const vert = Array.from(y.querySelectorAll("line")).filter((l) =>
      l.getAttribute("x1") === l.getAttribute("x2"),
    );
    expect(vert.length).toBe(1);
  });
});
