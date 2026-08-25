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
      <Chart.Svg height={300} loading {...noAnim}>
        <Chart.Line data={lineData} />
      </Chart.Svg>,
    );
    expect(document.querySelector("[style*='dsh-chart-spin']")).toBeTruthy();
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
    expect(grid.getAttribute("stroke-dasharray")).toBe("4 4");
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
    expect(vg[0].getAttribute("stroke-dasharray")).toBe("4 4");
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
