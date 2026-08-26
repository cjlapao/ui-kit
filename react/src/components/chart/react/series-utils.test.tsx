import { describe, expect, it } from "vitest";
import { summarizeChildren } from "./series-utils";

// Minimal stand-ins — summarizeChildren only discriminates by component type.
function Line(_props: Record<string, unknown>) {
  return null;
}
function noop() {
  return null;
}
const types = {
  Line,
  Bar: noop,
  Pie: noop,
  Candlestick: noop,
  RangeArea: noop,
  Radar: noop,
  RadarAxis: noop,
  Polar: noop,
  PolarAxis: noop,
  Scatter: noop,
  Gauge: noop,
  XAxis: noop,
  YAxis: noop,
  Legend: noop,
  Tooltip: noop,
  Hover: noop,
  Title: noop,
  Caption: noop,
  ReferenceLine: noop,
  ReferenceBand: noop,
  Annotation: noop,
  DataLabels: noop,
};

function firstLine(data: unknown[], extra: Record<string, unknown> = {}) {
  const summary = summarizeChildren(
    <Line data={data} name="S" {...extra} />,
    types,
  );
  expect(summary.series).toHaveLength(1);
  expect(summary.series[0].type).toBe("line");
  return summary.series[0].xAccessor!;
}

describe("default x-field inference", () => {
  it("prefers an `x` field over the category fallback", () => {
    const acc = firstLine([{ x: 10, y: 50 }, { x: 30, y: 70 }], {
      valueYField: "y",
    });
    expect(acc({ x: 10, y: 50 }, 0)).toBe(10);
  });

  it("keeps `date` for time data", () => {
    const d = new Date(2024, 0, 1);
    const acc = firstLine([{ date: d, value: 5 }]);
    expect(acc({ date: d, value: 5 }, 0)).toBe(d);
  });

  it("keeps `category` when present", () => {
    const acc = firstLine([{ category: "A", value: 5 }]);
    expect(acc({ category: "A", value: 5 }, 0)).toBe("A");
  });

  it("lets an explicit categoryXField win over `x`", () => {
    const acc = firstLine([{ x: 1, label: "L", value: 5 }], {
      categoryXField: "label",
    });
    expect(acc({ x: 1, label: "L", value: 5 }, 0)).toBe("L");
  });
});
