import { describe, expect, it } from "vitest";
import {
  computeRangeAreaGeometry,
  frameRangeAreaGeometry,
} from "./rangeArea";

const pts = (
  pairs: [number, number | null, number | null][],
) =>
  pairs.map(([x, min, max], i) => ({
    x,
    yMin: min === null ? null : 300 - min, // value → pixel (inverted)
    yMax: max === null ? null : 300 - max,
    min,
    max,
    item: { i },
    index: i,
  }));

describe("computeRangeAreaGeometry", () => {
  it("produces a closed band path and two open edge paths", () => {
    const g = computeRangeAreaGeometry({
      points: pts([
        [0, 80, 120],
        [100, 90, 140],
        [200, 100, 150],
      ]),
      curve: "linear",
    });
    expect(g.bandPath.endsWith("Z")).toBe(true);
    expect(g.upperPath.endsWith("Z")).toBe(false);
    expect(g.lowerPath.endsWith("Z")).toBe(false);
    expect(g.points).toHaveLength(3);
    // linear curve: the upper edge is a straight polyline through the
    // upper-edge pixels (300 - max).
    expect(g.upperPath).toBe("M0,180L100,160L200,150");
    expect(g.lowerPath).toBe("M0,220L100,210L200,200");
    expect(g.first?.yMax).toBe(180);
    expect(g.last?.yMin).toBe(200);
  });

  it("smooth curves shape both edges independently", () => {
    const g = computeRangeAreaGeometry({
      points: pts([
        [0, 80, 120],
        [100, 95, 150],
        [200, 85, 130],
        [300, 110, 170],
      ]),
      curve: "smooth",
    });
    expect(g.bandPath).toContain("C");
    expect(g.upperPath).toContain("C");
    expect(g.lowerPath).toContain("C");
  });

  it("gaps where either edge is missing break the sub-paths", () => {
    const g = computeRangeAreaGeometry({
      points: pts([
        [0, 80, 120],
        [100, null, 140],
        [200, 100, 150],
      ]),
      curve: "linear",
    });
    expect(g.points).toHaveLength(2);
    // two separate sub-paths (two M commands)
    expect(g.bandPath.match(/M/g)?.length).toBe(2);
    expect(g.upperPath.match(/M/g)?.length).toBe(2);
  });

  it("returns empty geometry for no data", () => {
    const g = computeRangeAreaGeometry({ points: [], curve: "linear" });
    expect(g.bandPath).toBe("");
    expect(g.upperPath).toBe("");
    expect(g.lowerPath).toBe("");
    expect(g.points).toHaveLength(0);
    expect(g.first).toBeNull();
    expect(g.last).toBeNull();
  });
});

describe("frameRangeAreaGeometry", () => {
  it("interpolates edges toward the previous geometry (update frames)", () => {
    const cur = computeRangeAreaGeometry({
      points: pts([
        [0, 100, 140],
        [100, 100, 140],
      ]),
      curve: "linear",
    });
    const prev = computeRangeAreaGeometry({
      points: pts([
        [0, 80, 120],
        [100, 80, 120],
      ]),
      curve: "linear",
    });
    const mid = frameRangeAreaGeometry(cur, prev, 0.5, "linear");
    // halfway between the two settled shapes
    expect(mid.first?.yMin).toBeCloseTo((200 + 220) / 2);
    expect(mid.first?.yMax).toBeCloseTo((160 + 180) / 2);
    expect(mid.bandPath.endsWith("Z")).toBe(true);
  });

  it("returns the current geometry when settled or without a previous one", () => {
    const cur = computeRangeAreaGeometry({
      points: pts([[0, 100, 140]]),
      curve: "linear",
    });
    expect(frameRangeAreaGeometry(cur, null, 0.5, "linear")).toBe(cur);
    expect(frameRangeAreaGeometry(cur, cur, 1, "linear")).toBe(cur);
  });
});
