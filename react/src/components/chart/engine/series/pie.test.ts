import { describe, it, expect } from "vitest";
import { computePieGeometry, pieLabelPoint } from "./pie";

describe("computePieGeometry", () => {
  const base = { cx: 100, cy: 100, outerRadius: 80 };

  it("slice angles sum to a full turn", () => {
    const g = computePieGeometry({
      items: [
        { value: 25, item: "a" },
        { value: 75, item: "b" },
      ],
      innerRadiusRatio: 0,
      ...base,
    });
    const sweep = g.slices.reduce(
      (acc, s) => acc + (s.endAngle - s.startAngle),
      0,
    );
    expect(sweep).toBeCloseTo(Math.PI * 2);
    expect(g.slices[0].endAngle - g.slices[0].startAngle).toBeCloseTo(Math.PI / 2); // 25%
  });

  it("donut cuts out the inner radius", () => {
    const g = computePieGeometry({
      items: [{ value: 100, item: "all" }],
      innerRadiusRatio: 0.6,
      ...base,
    });
    expect(g.innerRadius).toBeCloseTo(48);
    // a single full slice still renders a path
    expect(g.slices[0].path.length).toBeGreaterThan(10);
  });

  it("respects sweepAngle for gauges", () => {
    const g = computePieGeometry({
      items: [{ value: 100, item: "all" }],
      innerRadiusRatio: 0.7,
      startAngle: Math.PI * 0.75, // 9 o'clock
      sweepAngle: Math.PI * 1.5, // 270° gauge
      ...base,
    });
    const sweep = g.slices[0].endAngle - g.slices[0].startAngle;
    expect(sweep).toBeCloseTo(Math.PI * 1.5);
  });

  it("zero total yields no slices and no crash", () => {
    const g = computePieGeometry({
      items: [
        { value: 0, item: "a" },
        { value: 0, item: "b" },
      ],
      innerRadiusRatio: 0.5,
      ...base,
    });
    expect(g.slices).toHaveLength(0);
    expect(g.total).toBe(0);
  });

  it("computes pop-out offsets along the mid angle", () => {
    const g = computePieGeometry({
      items: [{ value: 100, item: "a" }],
      innerRadiusRatio: 0,
      ...base,
    });
    // single slice: mid angle = π (6 o'clock) → offset points down
    const off = g.slices[0].popOffset;
    expect(off.dy).toBeCloseTo(4);
    expect(off.dx).toBeCloseTo(0, 5);
  });

  it("keeps data order (no sorting)", () => {
    const g = computePieGeometry({
      items: [
        { value: 10, item: "first" },
        { value: 90, item: "second" },
      ],
      innerRadiusRatio: 0,
      ...base,
    });
    expect(g.slices[0].item).toBe("first");
    expect(g.slices[1].item).toBe("second");
  });
});

describe("pieLabelPoint", () => {
  it("places labels on the radius at the slice mid angle", () => {
    // angle 0 = 12 o'clock
    expect(pieLabelPoint(100, 100, 50, 0)).toEqual({ x: 100, y: 50 });
    // angle π/2 = 3 o'clock
    expect(pieLabelPoint(100, 100, 50, Math.PI / 2)).toEqual(
      expect.objectContaining({ x: 150, y: 100 }),
    );
  });
});
