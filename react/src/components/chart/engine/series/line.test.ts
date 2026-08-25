import { describe, it, expect } from "vitest";
import {
  bandAreaPath,
  computeLineGeometry,
  linePathFromPoints,
} from "./line";

const pt = (x: number, y: number | null, i: number) => ({
  x,
  y,
  value: y,
  item: { i },
  index: i,
});

describe("linePathFromPoints", () => {
  it("produces an exact straight path for the linear curve", () => {
    const path = linePathFromPoints(
      [
        { x: 0, y: 10 },
        { x: 50, y: 0 },
        { x: 100, y: 20 },
      ],
      "linear",
    );
    expect(path).toBe("M0,10L50,0L100,20");
  });

  it("handles a single point", () => {
    // d3 closes single-point paths (Z) — still one move to the point.
    expect(linePathFromPoints([{ x: 5, y: 5 }], "linear")).toBe("M5,5Z");
  });

  it("returns an empty string for no points", () => {
    expect(linePathFromPoints([], "linear")).toBe("");
  });

  it("produces C curves for smooth (monotone)", () => {
    const path = linePathFromPoints(
      [
        { x: 0, y: 0 },
        { x: 50, y: 30 },
        { x: 100, y: 10 },
        { x: 150, y: 40 },
      ],
      "smooth",
    );
    expect(path).toContain("C");
  });

  it("produces axis-aligned segments only for step curves", () => {
    const path = linePathFromPoints(
      [
        { x: 0, y: 0 },
        { x: 50, y: 30 },
        { x: 100, y: 10 },
      ],
      "step",
    );
    expect(path).not.toContain("C");
    // every segment changes exactly one coordinate (H or V, not diagonal)
    const pts = path
      .replace(/M/g, " ")
      .split(/[LVZ]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.split(",").map(Number));
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      expect(ax === bx || ay === by).toBe(true);
    }
  });
});

describe("computeLineGeometry", () => {
  const base = {
    curve: "linear" as const,
    connectNulls: "gap" as const,
    baselineY: 100,
    zeroY: 70,
  };

  it("computes marker points and first/last", () => {
    const g = computeLineGeometry({
      points: [pt(0, 10, 0), pt(50, 20, 1), pt(100, 30, 2)],
      ...base,
    });
    expect(g.points).toHaveLength(3);
    expect(g.first?.x).toBe(0);
    expect(g.last?.x).toBe(100);
    expect(g.points[1].value).toBe(20);
  });

  it("gap: null values break the path into sub-paths", () => {
    const g = computeLineGeometry({
      points: [pt(0, 10, 0), pt(50, null, 1), pt(100, 20, 2)],
      ...base,
      connectNulls: "gap",
    });
    const mCount = (g.linePath.match(/M/g) ?? []).length;
    expect(mCount).toBe(2); // two sub-paths
    expect(g.points).toHaveLength(2); // markers skip the null
  });

  it("connect: null values bridge straight across", () => {
    const g = computeLineGeometry({
      points: [pt(0, 10, 0), pt(50, null, 1), pt(100, 20, 2)],
      ...base,
      connectNulls: "connect",
    });
    expect((g.linePath.match(/M/g) ?? []).length).toBe(1);
    // path runs 0,10 → 100,20 (no point at x=50)
    expect(g.linePath).toBe("M0,10L100,20");
    expect(g.points).toHaveLength(2);
  });

  it("zero: null values dip to the zero line", () => {
    const g = computeLineGeometry({
      points: [pt(0, 10, 0), pt(50, null, 1), pt(100, 20, 2)],
      ...base,
      connectNulls: "zero",
    });
    expect(g.linePath).toBe("M0,10L50,70L100,20");
    expect(g.points[1].value).toBe(0);
  });

  it("area path closes to the baseline", () => {
    const g = computeLineGeometry({
      points: [pt(0, 10, 0), pt(100, 20, 1)],
      ...base,
    });
    expect(g.areaPath).toContain("100");
    // the area path must reference the baseline y
    expect(g.areaPath).toMatch(/100/);
    expect(g.areaPath.length).toBeGreaterThan(g.linePath.length);
  });

  it("all-null series produces empty geometry without crashing", () => {
    const g = computeLineGeometry({
      points: [pt(0, null, 0), pt(50, null, 1)],
      ...base,
    });
    expect(g.points).toHaveLength(0);
    expect(g.first).toBeNull();
    expect(g.last).toBeNull();
    expect(g.areaPath).toBe("");
  });
});

describe("bandAreaPath + fill between two lines", () => {
  it("closes between two edges (y0 lower, y1 upper)", () => {
    const path = bandAreaPath(
      [
        { x: 0, y0: 90, y1: 10 },
        { x: 100, y0: 80, y1: 0 },
      ],
      "linear",
    );
    expect(path.endsWith("Z")).toBe(true);
    // both edges are present in the path
    expect(path).toContain("M0,10");
    expect(path).toContain("0,90");
  });

  it("a constant baseline field equals the classic baseline-closed area", () => {
    const base = {
      curve: "linear" as const,
      connectNulls: "gap" as const,
      baselineY: 100,
      zeroY: 70,
    };
    const points = [pt(0, 10, 0), pt(100, 20, 1)];
    const classic = computeLineGeometry({ points, ...base });
    const field = computeLineGeometry({
      points,
      ...base,
      baselinePoints: [
        { x: 0, y: 100 },
        { x: 100, y: 100 },
      ],
    });
    expect(field.areaPath).toBe(classic.areaPath);
  });

  it("a varying baseline field produces a band-shaped area", () => {
    const base = {
      curve: "linear" as const,
      connectNulls: "gap" as const,
      baselineY: 100,
      zeroY: 70,
    };
    const points = [pt(0, 10, 0), pt(100, 20, 1)];
    const classic = computeLineGeometry({ points, ...base });
    const field = computeLineGeometry({
      points,
      ...base,
      baselinePoints: [
        { x: 0, y: 90 },
        { x: 100, y: 40 },
      ],
    });
    expect(field.areaPath).not.toBe(classic.areaPath);
    // the band's lower edge follows the baseline curve (both y values)
    expect(field.areaPath).toContain("90");
    expect(field.areaPath).toContain("40");
    // the line itself is untouched
    expect(field.linePath).toBe(classic.linePath);
  });

  it("a missing baseline value turns the point into a gap", () => {
    const base = {
      curve: "linear" as const,
      connectNulls: "gap" as const,
      baselineY: 100,
      zeroY: 70,
    };
    const points = [pt(0, 10, 0), pt(50, 15, 1), pt(100, 20, 2)];
    const g = computeLineGeometry({
      points,
      ...base,
      baselinePoints: [
        { x: 0, y: 90 },
        { x: 50, y: null },
        { x: 100, y: 40 },
      ],
    });
    // the line keeps all three points; the area breaks into two sub-paths
    expect(g.points).toHaveLength(3);
    expect(g.areaPath.match(/M/g)?.length).toBe(2);
  });
});
