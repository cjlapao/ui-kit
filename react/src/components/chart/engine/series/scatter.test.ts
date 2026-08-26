import { describe, expect, it } from "vitest";
import { createLinearScale } from "../scales";
import {
  computeScatterGeometry,
  frameScatterGeometry,
  hitTestScatter,
} from "./scatter";

const data = [
  { x: 10, y: 20, size: 50 },
  { x: 20, y: 40, size: 150 },
  { x: 30, y: 60, size: 100 },
  { x: 40, y: 80, size: 50 },
];

const xScale = createLinearScale({ domain: [0, 50], range: [0, 500] });
const yScale = createLinearScale({ domain: [0, 100], range: [400, 0] });

const acc =
  (field: string) =>
  (item: unknown, _i: number) =>
    (item as Record<string, number>)[field] ?? null;

describe("computeScatterGeometry", () => {
  it("maps every finite row to pixel coordinates", () => {
    const g = computeScatterGeometry({
      data,
      xAccessor: acc("x"),
      yAccessor: acc("y"),
      xScale,
      yScale,
    });
    expect(g.points).toHaveLength(4);
    // x=10 → 100px; y=20 → 400 - 80 = 320px.
    expect(g.points[0].x).toBeCloseTo(100);
    expect(g.points[0].y).toBeCloseTo(320);
  });

  it("skips rows with a missing y", () => {
    const g = computeScatterGeometry({
      data: [{ x: 1, y: 5 }, { x: 2, y: null }, { x: 3, y: 7 }],
      xAccessor: acc("x"),
      yAccessor: acc("y"),
      xScale,
      yScale,
    });
    expect(g.points).toHaveLength(2);
  });

  it("scales bubble radii area-proportionally into [minSize, maxSize]", () => {
    const g = computeScatterGeometry({
      data,
      xAccessor: acc("x"),
      yAccessor: acc("y"),
      sizeAccessor: acc("size"),
      xScale,
      yScale,
      minSize: 6,
      maxSize: 26,
    });
    // min size value → minSize; max size value → maxSize.
    expect(g.points[0].r).toBeCloseTo(6);
    expect(g.points[1].r).toBeCloseTo(26);
    // Middle value (100 of 50..150 → √0.5 ≈ 0.707) → 6 + 20·0.707.
    expect(g.points[2].r).toBeCloseTo(6 + 20 * Math.SQRT1_2, 1);
  });

  it("renders uniform minSize dots without a size field", () => {
    const g = computeScatterGeometry({
      data,
      xAccessor: acc("x"),
      yAccessor: acc("y"),
      xScale,
      yScale,
      minSize: 5,
      maxSize: 25,
    });
    expect(g.points.every((p) => p.r === 5)).toBe(true);
  });

  it("handles a single distinct size value", () => {
    const g = computeScatterGeometry({
      data,
      xAccessor: acc("x"),
      yAccessor: acc("y"),
      sizeAccessor: () => 100,
      xScale,
      yScale,
      minSize: 6,
      maxSize: 26,
    });
    expect(g.points.every((p) => p.r === 6)).toBe(true);
  });
});

describe("frameScatterGeometry", () => {
  const from = {
    points: [
      { x: 0, y: 0, r: 5 },
      { x: 100, y: 100, r: 10 },
    ],
  };
  const to = {
    points: [
      { x: 50, y: 50, r: 8 },
      { x: 200, y: 200, r: 20 },
      { x: 300, y: 300, r: 15 },
    ],
  };

  it("morphs x/y/r between matched points", () => {
    const g = frameScatterGeometry(from, to, 0.5);
    expect(g.points).toHaveLength(3);
    expect(g.points[0].x).toBeCloseTo(25);
    expect(g.points[0].y).toBeCloseTo(25);
    expect(g.points[0].r).toBeCloseTo(6.5);
    expect(g.points[1].r).toBeCloseTo(15);
    // New point grows in at its position.
    expect(g.points[2].x).toBe(300);
    expect(g.points[2].r).toBeCloseTo(7.5);
  });

  it("returns the target unchanged at t=1", () => {
    expect(frameScatterGeometry(from, to, 1)).toBe(to);
  });

  it("grows from r=0 on entrance (prev = null)", () => {
    const g = frameScatterGeometry(null, to, 0.4);
    expect(g.points).toHaveLength(3);
    expect(g.points[0].x).toBe(50);
    expect(g.points[0].r).toBeCloseTo(3.2);
  });

  it("shrinks removed points out", () => {
    const g = frameScatterGeometry(to, from, 0.5);
    expect(g.points).toHaveLength(3);
    expect(g.points[2].r).toBeCloseTo(7.5);
    expect(g.points[2].x).toBe(300);
  });
});

describe("hitTestScatter", () => {
  const points = [
    { x: 0, y: 0, r: 10 },
    { x: 60, y: 0, r: 10 },
    { x: 30, y: 40, r: 5 },
  ];

  it("hits the nearest point within radius + slop", () => {
    expect(hitTestScatter(points, 55, 2, 2)).toBe(1);
    expect(hitTestScatter(points, 4, 0, 2)).toBe(0);
  });

  it("returns null outside every point", () => {
    expect(hitTestScatter(points, 100, 100, 2)).toBeNull();
    expect(hitTestScatter(points, 30, 60, 1)).toBeNull();
  });

  it("respects the extra hit radius for small points", () => {
    const small = [{ x: 0, y: 0, r: 2 }];
    expect(hitTestScatter(small, 0, 5, 3)).toBe(0);
    expect(hitTestScatter(small, 0, 6, 3)).toBeNull();
  });
});
