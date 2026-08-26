import { describe, expect, it } from "vitest";
import { computeGaugeGeometry, lerpColor, GAUGE_ZONE_SUBDIVISIONS } from "./gauge";

const base = {
  cx: 100,
  cy: 100,
  outerRadius: 80,
};

describe("computeGaugeGeometry", () => {
  it("maps the value to the right angle (270° default, gap at bottom)", () => {
    const g = computeGaugeGeometry({ value: 50, min: 0, max: 100, ...base });
    // startAngle = π + (2π − 1.5·2π)/2 = 1.25π; midpoint of the span = 2.75π ≡ 0.75π
    expect(g.startAngle).toBeCloseTo(1.25 * Math.PI, 10);
    expect(g.valueFraction).toBe(0.5);
    expect(g.valueAngle).toBeCloseTo(g.startAngle + g.arcSpan * 0.5, 10);
    // full span is 270°
    expect(g.arcSpan).toBeCloseTo(1.5 * Math.PI, 10); // 270°
  });

  it("supports a 180° semicircle", () => {
    const g = computeGaugeGeometry({
      value: 100,
      min: 0,
      max: 100,
      arcSpan: Math.PI,
      startAngle: Math.PI,
      ...base,
    });
    expect(g.arcSpan).toBeCloseTo(Math.PI, 10);
    expect(g.valueAngle).toBeCloseTo(2 * Math.PI, 10); // left → right
    expect(g.trackSegment).toBeNull(); // full value fills the span
  });

  it("clamps the value into [min, max]", () => {
    const g = computeGaugeGeometry({ value: 150, min: 0, max: 100, ...base });
    expect(g.valueFraction).toBe(1);
    expect(g.trackSegment).toBeNull();
  });

  it("renders a track for the remaining span", () => {
    const g = computeGaugeGeometry({ value: 25, min: 0, max: 100, ...base });
    expect(g.trackSegment).toBeTruthy();
    expect(g.trackSegment!.startAngle).toBeCloseTo(g.valueAngle, 10);
    expect(g.trackSegment!.endAngle).toBeCloseTo(g.startAngle + g.arcSpan, 10);
  });

  it("subdivides zones into colored segments across the full span", () => {
    const g = computeGaugeGeometry({
      value: 100,
      min: 0,
      max: 100,
      zones: [
        { from: 0, to: 50, color: "#22c55e" },
        { from: 50, to: 100, color: "#ef4444" },
      ],
      ...base,
    });
    expect(g.fillSegments.length).toBe(2 * GAUGE_ZONE_SUBDIVISIONS);
    // first segment starts at the gauge start, last ends at the gauge end
    expect(g.fillSegments[0].startAngle).toBeCloseTo(g.startAngle, 10);
    expect(
      g.fillSegments[g.fillSegments.length - 1].endAngle,
    ).toBeCloseTo(g.startAngle + g.arcSpan, 10);
    // segments tile the span with no gaps
    for (let i = 1; i < g.fillSegments.length; i++) {
      expect(g.fillSegments[i].startAngle).toBeCloseTo(
        g.fillSegments[i - 1].endAngle,
        10,
      );
    }
  });

  it("covers zone gaps with the fallback color", () => {
    const g = computeGaugeGeometry({
      value: 100,
      min: 0,
      max: 100,
      zones: [{ from: 40, to: 60, color: "#ef4444" }],
      ...base,
    });
    // 3 coverage runs × subdivisions
    expect(g.fillSegments.length).toBe(3 * GAUGE_ZONE_SUBDIVISIONS);
    expect(g.fillSegments[0].color).toBe("#e5e7eb");
  });

  it("computes tick positions and majors", () => {
    const g = computeGaugeGeometry({
      value: 50,
      min: 0,
      max: 100,
      ticks: { count: 10, majorEvery: 5 },
      ...base,
    });
    expect(g.ticks.length).toBe(11); // inclusive
    expect(g.ticks[0].angle).toBeCloseTo(g.startAngle, 10);
    expect(g.ticks[10].angle).toBeCloseTo(g.startAngle + g.arcSpan, 10);
    expect(g.ticks.filter((t) => t.major).length).toBe(3); // 0, 5, 10
  });

  it("has no ticks by default", () => {
    const g = computeGaugeGeometry({ value: 50, min: 0, max: 100, ...base });
    expect(g.ticks.length).toBe(0);
  });

  it("places the target marker at its value's angle", () => {
    const g = computeGaugeGeometry({
      value: 50,
      min: 0,
      max: 100,
      targetValue: 80,
      ...base,
    });
    expect(g.target).toBeTruthy();
    expect(g.target!.angle).toBeCloseTo(g.angleFor(80), 10);
    const r = Math.hypot(g.target!.x - base.cx, g.target!.y - base.cy);
    expect(r).toBeCloseTo((g.innerRadius + g.outerRadius) / 2, 6);
  });

  it("is safe with a degenerate domain", () => {
    const g = computeGaugeGeometry({ value: 5, min: 10, max: 10, ...base });
    expect(g.valueFraction).toBe(0);
    expect(g.fillSegments.length).toBeGreaterThan(0);
    expect(g.target).toBeNull();
  });
});

describe("lerpColor", () => {
  it("interpolates between colors", () => {
    expect(lerpColor("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(lerpColor("#000000", "#ffffff", 0)).toBe("#000000");
  });
});
