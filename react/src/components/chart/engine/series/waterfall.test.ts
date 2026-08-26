import { describe, it, expect } from "vitest";
import { computeWaterfallSteps } from "./waterfall";

describe("computeWaterfallSteps", () => {
  it("accumulates deltas and anchors totals at zero", () => {
    const data = [13.2, 12.9, 40.3, -19.1, -7.6];
    const { steps } = computeWaterfallSteps({
      data: data as number[],
      categoryField: (i) => `c${i}`,
      valueField: (v) => v,
      totalField: (_v, i) => i === 2,
    });
    expect(steps[0].lo).toBe(0);
    expect(steps[0].hi).toBe(13.2);
    expect(steps[1].lo).toBeCloseTo(13.2);
    expect(steps[1].hi).toBeCloseTo(26.1);
    // total bar: 0 → 40.3, running resets to 40.3
    expect(steps[2].lo).toBe(0);
    expect(steps[2].hi).toBe(40.3);
    expect(steps[2].total).toBe(true);
    // delta continues from 40.3
    expect(steps[3].lo).toBeCloseTo(40.3);
    expect(steps[3].hi).toBeCloseTo(21.2);
    expect(steps[4].hi).toBeCloseTo(13.6);
    expect(steps[4].running).toBeCloseTo(13.6);
  });

  it("handles negative-only bridges below zero", () => {
    const { steps } = computeWaterfallSteps({
      data: [-5, -3, 2],
      categoryField: (_i) => "x",
      valueField: (v: number) => v,
    });
    expect(steps[0].lo).toBe(0);
    expect(steps[0].hi).toBe(-5);
    expect(steps[1].lo).toBe(-5);
    expect(steps[1].hi).toBe(-8);
    expect(steps[2].lo).toBe(-8);
    expect(steps[2].hi).toBe(-6);
  });

  it("layers sum to the step delta and provide the span", () => {
    const { steps } = computeWaterfallSteps({
      data: [
        { layers: [{ name: "core", value: 130 }, { name: "incr", value: 70 }] },
        { layers: [{ name: "core", value: -65 }, { name: "incr", value: -60 }] },
      ],
      categoryField: (_i) => "x",
      valueField: () => 0,
      layersField: (i: { layers: { name: string; value: number }[] }) =>
        i.layers,
    });
    expect(steps[0].delta).toBe(200);
    expect(steps[0].lo).toBe(0);
    expect(steps[0].hi).toBe(200);
    expect(steps[1].delta).toBe(-125);
    expect(steps[1].lo).toBe(200);
    expect(steps[1].hi).toBe(75);
  });

  it("returns spans for the y-domain", () => {
    const { spans } = computeWaterfallSteps({
      data: [10, -4, 6],
      categoryField: (_i) => "x",
      valueField: (v: number) => v,
    });
    expect(spans).toEqual([
      [0, 10],
      [10, 6],
      [6, 12],
    ]);
  });

  it("is safe on empty / non-finite data", () => {
    const { steps } = computeWaterfallSteps({
      data: [] as number[],
      categoryField: (i) => `c${i}`,
      valueField: (v) => v,
    });
    expect(steps).toEqual([]);
    const { steps: s2 } = computeWaterfallSteps({
      data: [Number.NaN, 5] as number[],
      categoryField: (i) => `c${i}`,
      valueField: (v) => v,
    });
    expect(s2[0].delta).toBe(0);
    expect(s2[1].hi).toBe(5);
  });
});
