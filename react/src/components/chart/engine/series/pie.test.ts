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

  it("padAngle opens gaps between slices (visual narrowing, full angles)", () => {
    const items = [
      { value: 35, item: "a" },
      { value: 25, item: "b" },
      { value: 20, item: "c" },
      { value: 20, item: "d" },
    ];
    const plain = computePieGeometry({
      items,
      innerRadiusRatio: 0.6,
      ...base,
    });
    const padded = computePieGeometry({
      items,
      innerRadiusRatio: 0.6,
      padAngle: 0.02,
      ...base,
    });
    // d3 pads the arc PATH (radial narrowing), not the angular ranges —
    // slice angles/labels/hit-testing stay exact.
    const plainSweep = plain.slices.reduce(
      (acc, s) => acc + (s.endAngle - s.startAngle),
      0,
    );
    const paddedSweep = padded.slices.reduce(
      (acc, s) => acc + (s.endAngle - s.startAngle),
      0,
    );
    expect(plainSweep).toBeCloseTo(Math.PI * 2);
    expect(paddedSweep).toBeCloseTo(Math.PI * 2);
    expect(padded.slices[0].startAngle).toBeCloseTo(
      plain.slices[0].startAngle,
    );
    // the padded path is visibly different (extra edge cuts)
    expect(padded.slices[0].path).not.toBe(plain.slices[0].path);
  });

  it("cornerRadius rounds slice corners without changing angles", () => {
    const plain = computePieGeometry({
      items: [
        { value: 40, item: "a" },
        { value: 60, item: "b" },
      ],
      innerRadiusRatio: 0.5,
      ...base,
    });
    const rounded = computePieGeometry({
      items: [
        { value: 40, item: "a" },
        { value: 60, item: "b" },
      ],
      innerRadiusRatio: 0.5,
      cornerRadius: 6,
      ...base,
    });
    expect(rounded.slices[0].startAngle).toBeCloseTo(plain.slices[0].startAngle);
    expect(rounded.slices[0].endAngle).toBeCloseTo(plain.slices[0].endAngle);
    // the arc carries corner arcs (A commands with the corner radius)
    expect(rounded.slices[0].path).toContain("A6,6");
    expect(plain.slices[0].path).not.toContain("A6,6");
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

describe("nightingale (rose) mode", () => {
  const input = {
    items: [
      { value: 10, item: "a" },
      { value: 40, item: "b" },
      { value: 20, item: "c" },
      { value: 0, item: "d" },
    ],
    innerRadiusRatio: 0.3,
    nightingale: true,
    cx: 0,
    cy: 0,
    outerRadius: 100,
  };

  it("uses equal slice angles", () => {
    const g = computePieGeometry(input);
    for (const s of g.slices) {
      expect(s.endAngle - s.startAngle).toBeCloseTo((Math.PI * 2) / 4, 10);
    }
  });

  it("scales radii: max → outer, min → hub, mid → lerp", () => {
    const g = computePieGeometry(input);
    const hub = 100 * 0.3;
    expect(g.slices[1].sliceRadius).toBeCloseTo(100, 6); // value 40 = max
    expect(g.slices[0].sliceRadius).toBeCloseTo(hub + (100 - hub) * 0.25, 6); // 10/40
    expect(g.slices[2].sliceRadius).toBeCloseTo(hub + (100 - hub) * 0.5, 6); // 20/40
    expect(g.slices[3].sliceRadius).toBeCloseTo(hub, 6); // 0 → hub
  });

  it("keeps the real total for the center readout", () => {
    const g = computePieGeometry(input);
    expect(g.total).toBe(70);
  });

  it("is safe with all-zero values", () => {
    const g = computePieGeometry({
      ...input,
      items: [
        { value: 0, item: "a" },
        { value: 0, item: "b" },
      ],
    });
    expect(g.slices.length).toBe(0);
    expect(g.total).toBe(0);
  });

  it("does not affect regular pie radii", () => {
    const g = computePieGeometry({ ...input, nightingale: false });
    for (const s of g.slices) {
      expect(s.sliceRadius).toBeCloseTo(100, 6);
    }
  });
});
