import { describe, expect, it } from "vitest";
import {
  computeRadarGeometry,
  computeRadarGrid,
  frameRadarGeometry,
  niceRadarMax,
  radarAngle,
} from "./radar";

const C = { cx: 0, cy: 0, R: 100 };

describe("radarAngle", () => {
  it("starts at 12 o'clock and runs clockwise", () => {
    expect(radarAngle(0, 8)).toBeCloseTo(-Math.PI / 2);
    expect(radarAngle(1, 8)).toBeCloseTo(-Math.PI / 4); // top-right
    expect(radarAngle(2, 8)).toBeCloseTo(0); // 3 o'clock
    expect(radarAngle(4, 8)).toBeCloseTo(Math.PI / 2); // 6 o'clock
  });
});

describe("niceRadarMax", () => {
  it("extends to a round multiple of the ring step", () => {
    expect(niceRadarMax(97, 4)).toBe(100);
    expect(niceRadarMax(50, 4)).toBe(80); // 12.5 → next clean step 20
    expect(niceRadarMax(60, 4)).toBe(80);
    expect(niceRadarMax(1, 4)).toBe(1); // fits exactly, no growth
  });

  it("handles degenerate input", () => {
    expect(niceRadarMax(0, 4)).toBe(4);
    expect(niceRadarMax(NaN, 4)).toBe(4);
  });
});

describe("computeRadarGeometry", () => {
  it("maps values onto a closed polygon", () => {
    const g = computeRadarGeometry({
      values: [100, 50, 0, 25],
      ...C,
      domainMax: 100,
    });
    expect(g.points).toHaveLength(4);
    // axis 0 (top) at full radius → (0, -100)
    expect(g.points[0].x).toBeCloseTo(0);
    expect(g.points[0].y).toBeCloseTo(-100);
    // axis 1 (3 o'clock for 4 axes) at half radius
    expect(g.points[1].x).toBeCloseTo(50);
    expect(g.points[1].y).toBeCloseTo(0);
    // axis 2 (right) at zero radius → center
    expect(g.points[2].x).toBeCloseTo(0);
    expect(g.points[2].y).toBeCloseTo(0);
    expect(g.linePath).toContain("M");
    expect(g.linePath.endsWith("Z")).toBe(true);
    expect(g.fillPath).toBe(g.linePath);
    expect(g.hasGaps).toBe(false);
    expect(g.first?.axis).toBe(0);
    expect(g.last?.axis).toBe(3);
  });

  it("clamps values outside the domain to the ring edges", () => {
    const g = computeRadarGeometry({
      values: [150, -20, 10, 10],
      ...C,
      domainMax: 100,
    });
    expect(g.points[0].y).toBeCloseTo(-100); // clamped to outer ring
    expect(g.points[1].x).toBeCloseTo(0); // clamped to center
  });

  it("breaks the polygon on missing values", () => {
    const g = computeRadarGeometry({
      values: [100, null, 100, 100],
      ...C,
      domainMax: 100,
    });
    expect(g.points).toHaveLength(3);
    expect(g.hasGaps).toBe(true);
    // open sub-path: no Z
    expect(g.linePath.endsWith("Z")).toBe(false);
  });

  it("returns empty geometry for no data", () => {
    const g = computeRadarGeometry({ values: [], ...C, domainMax: 100 });
    expect(g.points).toHaveLength(0);
    expect(g.linePath).toBe("");
    expect(g.first).toBeNull();
  });
});

describe("computeRadarGrid", () => {
  const base = {
    axes: ["A", "B", "C", "D"],
    cx: 100,
    cy: 100,
    R: 100,
    rings: 4,
    domainMax: 100,
  };

  it("builds rings, spokes and tick labels", () => {
    const g = computeRadarGrid(base);
    expect(g.ringPaths).toHaveLength(4);
    expect(g.ringPaths[0].endsWith("Z")).toBe(true);
    expect(g.ringValues).toEqual([25, 50, 75, 100]);
    expect(g.spokes).toHaveLength(4);
    expect(g.spokes[0].x2).toBeCloseTo(100); // top axis: straight up
    expect(g.spokes[0].y2).toBeCloseTo(0);
    expect(g.spokes[0].label).toBe("A");
    expect(g.tickLabels).toHaveLength(4);
    expect(g.tickLabels[0].text).toBe("25");
    // tick labels sit just left of the top axis at each ring height
    expect(g.tickLabels[0].x).toBeCloseTo(93);
    expect(g.tickLabels[0].y).toBeCloseTo(100 - 25 + 4);
  });

  it("applies a custom tick format", () => {
    const g = computeRadarGrid({ ...base, format: (v) => `${v} pts` });
    expect(g.tickLabels[3].text).toBe("100 pts");
  });
});

describe("frameRadarGeometry", () => {
  it("interpolates points toward the current geometry", () => {
    const cur = computeRadarGeometry({
      values: [100, 100, 100, 100],
      ...C,
      domainMax: 100,
    });
    const prev = computeRadarGeometry({
      values: [0, 0, 0, 0],
      ...C,
      domainMax: 100,
    });
    const mid = frameRadarGeometry(cur, prev, 0.5);
    // halfway out from the center
    expect(mid.points[0].y).toBeCloseTo(-50);
    expect(mid.linePath.endsWith("Z")).toBe(true);
  });

  it("returns the current geometry when settled or without a previous one", () => {
    const cur = computeRadarGeometry({
      values: [10, 20, 30, 40],
      ...C,
      domainMax: 100,
    });
    expect(frameRadarGeometry(cur, null, 0.5)).toBe(cur);
    expect(frameRadarGeometry(cur, cur, 1)).toBe(cur);
  });
});
