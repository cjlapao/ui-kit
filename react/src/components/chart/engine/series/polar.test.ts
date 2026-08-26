import { describe, expect, it } from "vitest";
import {
  computePolarGeometry,
  computePolarGrid,
  framePolarGeometry,
  hitTestPolar,
  nicePolarMax,
  polarAngle,
  roundedAnnularSector,
} from "./polar";
import { resolveGrid, gridDashArray, gridLineDash } from "../grid";

describe("polarAngle", () => {
  it("starts at 12 o'clock and proceeds clockwise", () => {
    expect(polarAngle(0, 8)).toBeCloseTo(-Math.PI / 2); // 12 o'clock
    expect(polarAngle(2, 8)).toBeCloseTo(0); // 3 o'clock
    expect(polarAngle(4, 8)).toBeCloseTo(Math.PI / 2); // 6 o'clock
    expect(polarAngle(7, 8)).toBeCloseTo(-Math.PI / 2 + (7 * 2 * Math.PI) / 8);
  });
});

describe("nicePolarMax", () => {
  it("extends to clean ring steps", () => {
    expect(nicePolarMax(97, 4)).toBe(100);
    expect(nicePolarMax(50, 4)).toBe(80);
    expect(nicePolarMax(40, 4)).toBe(40);
  });
});

describe("roundedAnnularSector", () => {
  const cx = 100;
  const cy = 100;

  it("plain sector: outer arc, line in, inner arc back, close", () => {
    const d = roundedAnnularSector(cx, cy, 30, 60, 0, Math.PI / 2, 0);
    expect(d.startsWith("M")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
    expect(d).toContain("A60 60");
    expect(d).toContain("A30 30");
    expect(d).toContain("L");
  });

  it("returns an empty path for a degenerate wedge", () => {
    expect(roundedAnnularSector(cx, cy, 60, 30, 0, Math.PI / 2, 0)).toBe("");
    expect(roundedAnnularSector(cx, cy, 30, 60, 0.5, 0.5, 0)).toBe("");
  });

  it("rounds corners with small arcs when a radius is set", () => {
    const d = roundedAnnularSector(cx, cy, 30, 60, 0, Math.PI / 2, 8);
    // Four corner arcs of radius 8 (or the clamped value).
    const cornerArcs = (d.match(/A8 8 0 0 1 /g) ?? []).length;
    expect(cornerArcs).toBe(4);
  });

  it("clamps the corner radius to fit a thin wedge", () => {
    // Very thin angular wedge: the requested 20 px radius cannot fit.
    const d = roundedAnnularSector(cx, cy, 30, 60, 0, 0.1, 20);
    // No corner arc larger than the wedge can fit; the path is still valid.
    expect(d.startsWith("M")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
    // The plain-sector fallback kicks in when the clamp goes ≤ 0.5.
    const big = roundedAnnularSector(cx, cy, 30, 60, 0, 0.05, 20);
    expect(big).toContain("A60 60");
  });
});

describe("computePolarGeometry (group mode)", () => {
  const input = {
    categories: ["A", "B", "C", "D"],
    series: [
      { id: "s1", values: [10, 20, 30, 40] },
      { id: "s2", values: [15, 25, 35, 45] },
    ],
    mode: "group" as const,
    cx: 100,
    cy: 100,
    R: 100,
    innerR: 20,
    valueMax: 50,
  };

  it("produces one segment per present value", () => {
    const g = computePolarGeometry(input);
    expect(g.segments.length).toBe(8);
    expect(g.n).toBe(4);
  });

  it("maps values to radii on the shared scale", () => {
    const g = computePolarGeometry(input);
    const a0s1 = g.segments.find((s) => s.seriesId === "s1" && s.categoryIndex === 0)!;
    // usable = 80; kGroup = 80/50 = 1.6 → value 10 → r1 = 20 + 16
    expect(a0s1.rInner).toBeCloseTo(20);
    expect(a0s1.rOuter).toBeCloseTo(20 + 10 * 1.6);
    const a0s2 = g.segments.find((s) => s.seriesId === "s2" && s.categoryIndex === 0)!;
    expect(a0s2.rOuter).toBeCloseTo(20 + 15 * 1.6);
  });

  it("splits the slot into equal sub-arcs per series", () => {
    const g = computePolarGeometry(input);
    const cat0 = g.segments.filter((s) => s.categoryIndex === 0);
    const slot = Math.PI / 2; // 4 categories
    const gap = 0.04; // default gapAngle
    expect(cat0[0].a1 - cat0[0].a0).toBeCloseTo((slot - gap) / 2);
    expect(cat0[0].a1).toBeCloseTo(cat0[1].a0);
  });

  it("skips missing values without breaking the layout", () => {
    const g = computePolarGeometry({
      ...input,
      series: [
        { id: "s1", values: [10, null, 30, 40] },
        { id: "s2", values: [15, 25, 35, 45] },
      ],
    });
    expect(g.segments.length).toBe(7);
    // Category 1 keeps a single full-sub-arc for the surviving series.
    const cat1 = g.segments.filter((s) => s.categoryIndex === 1);
    expect(cat1.length).toBe(1);
    // The surviving series takes the whole usable slot span.
    expect(cat1[0].a1 - cat1[0].a0).toBeCloseTo(Math.PI / 2 - 0.04);
  });
});

describe("computePolarGeometry (stack mode)", () => {
  const input = {
    categories: ["A", "B"],
    series: [
      { id: "s1", values: [30, 10] },
      { id: "s2", values: [30, 30] },
    ],
    mode: "stack" as const,
    cx: 100,
    cy: 100,
    R: 100,
    innerR: 20,
    valueMax: 100,
    bandGap: 2,
  };

  it("stacks bands inner→outer on the max-total scale", () => {
    const g = computePolarGeometry(input);
    // max total = 60 (both categories); usable = 80; bands = 2, gap = 2
    // k = (80 - 2) / 60
    const k = 78 / 60;
    const s1 = g.segments.find((s) => s.seriesId === "s1" && s.categoryIndex === 0)!;
    const s2 = g.segments.find((s) => s.seriesId === "s2" && s.categoryIndex === 0)!;
    expect(s1.rInner).toBeCloseTo(20);
    expect(s1.rOuter).toBeCloseTo(20 + 30 * k);
    expect(s2.rInner).toBeCloseTo(20 + 30 * k + 2);
    expect(s2.rOuter).toBeCloseTo(20 + 60 * k + 2);
  });

  it("uses the full slot for every band", () => {
    const g = computePolarGeometry(input);
    const slot = Math.PI; // 2 categories
    const s1 = g.segments.find((s) => s.seriesId === "s1" && s.categoryIndex === 0)!;
    expect(s1.a1 - s1.a0).toBeCloseTo(slot - 0.04); // minus gapAngle
  });
});

describe("computePolarGeometry", () => {
  it("returns no segments for empty input", () => {
    const g = computePolarGeometry({
      categories: [],
      series: [{ id: "s1", values: [] }],
      mode: "group",
      cx: 0,
      cy: 0,
      R: 50,
      innerR: 0,
      valueMax: 10,
    });
    expect(g.segments).toHaveLength(0);
  });
});

describe("hitTestPolar", () => {
  const g = computePolarGeometry({
    categories: ["A", "B", "C", "D"],
    series: [
      { id: "s1", values: [50, 50, 50, 50] },
      { id: "s2", values: [50, 50, 50, 50] },
    ],
    mode: "stack",
    cx: 0,
    cy: 0,
    R: 100,
    innerR: 20,
    valueMax: 100,
    gapAngle: 0,
    bandGap: 0,
  });

  it("finds the outermost segment under a stacked pointer", () => {
    // Category A spans -90°..-45°; midpoint angle = -67.5° (upper right).
    const a = -Math.PI / 2 + Math.PI / 8;
    const hitOuter = hitTestPolar(g.segments, Math.cos(a) * 90, Math.sin(a) * 90, 0, 0);
    expect(hitOuter?.seriesId).toBe("s2");
    const hitInner = hitTestPolar(g.segments, Math.cos(a) * 30, Math.sin(a) * 30, 0, 0);
    expect(hitInner?.seriesId).toBe("s1");
  });

  it("misses outside the outer radius and inside the hole", () => {
    const a = -Math.PI / 2 + Math.PI / 8;
    expect(hitTestPolar(g.segments, Math.cos(a) * 150, Math.sin(a) * 150, 0, 0)).toBeNull();
    expect(hitTestPolar(g.segments, Math.cos(a) * 10, Math.sin(a) * 10, 0, 0)).toBeNull();
  });

  it("misses between slots (angular gap)", () => {
    const gapped = computePolarGeometry({
      categories: ["A", "B", "C", "D"],
      series: [{ id: "s1", values: [50, 50, 50, 50] }],
      mode: "group",
      cx: 0,
      cy: 0,
      R: 100,
      innerR: 20,
      valueMax: 100,
      gapAngle: 0.2,
    });
    // Exactly on the axis between slots A and B (3 o'clock, angle 0).
    expect(hitTestPolar(gapped.segments, 50, 0, 0, 0)).toBeNull();
  });
});

describe("framePolarGeometry", () => {
  const base = {
    cx: 0,
    cy: 0,
    segmentRadius: 0,
  };
  const cur = computePolarGeometry({
    categories: ["A", "B"],
    series: [{ id: "s1", values: [50, 100] }],
    mode: "group",
    cx: 0,
    cy: 0,
    R: 100,
    innerR: 0,
    valueMax: 100,
    gapAngle: 0,
  });
  const prev = computePolarGeometry({
    categories: ["A", "B"],
    series: [{ id: "s1", values: [100, 50] }],
    mode: "group",
    cx: 0,
    cy: 0,
    R: 100,
    innerR: 0,
    valueMax: 100,
    gapAngle: 0,
  });

  it("interpolates radii between previous and current", () => {
    const framed = framePolarGeometry(cur, prev, 0.5, base);
    const seg = framed.segments.find((s) => s.categoryIndex === 0)!;
    expect(seg.rOuter).toBeCloseTo((100 + 50) / 2);
  });

  it("returns the current geometry when settled or without a previous", () => {
    expect(framePolarGeometry(cur, null, 0.4, base)).toBe(cur);
    expect(framePolarGeometry(cur, prev, 1, base)).toBe(cur);
  });
});

describe("computePolarGrid", () => {
  it("builds circle rings and spokes", () => {
    const g = computePolarGrid({
      categories: ["A", "B", "C"],
      cx: 100,
      cy: 100,
      R: 100,
      rings: 4,
      domainMax: 100,
      shape: "circle",
    });
    expect(g.ringPaths.length).toBe(4);
    expect(g.ringPaths[0]).toContain("A25 25");
    expect(g.spokes.length).toBe(3);
    expect(g.spokes[0].label).toBe("A");
    expect(g.spokes[0].x1).toBe(100);
    expect(g.spokes[0].y1).toBe(100);
  });

  it("builds polygon rings for gridShape=polygon", () => {
    const g = computePolarGrid({
      categories: ["A", "B", "C", "D"],
      cx: 100,
      cy: 100,
      R: 100,
      rings: 2,
      domainMax: 100,
      shape: "polygon",
    });
    // Outer ring is a 4-gon: M then three Ls then Z.
    expect(g.ringPaths[1]).toMatch(/^M.*L.*L.*L.*Z$/);
  });

  it("labels tick values along the top axis, left side", () => {
    const g = computePolarGrid({
      categories: ["A", "B", "C"],
      cx: 100,
      cy: 100,
      R: 100,
      rings: 4,
      domainMax: 100,
      shape: "circle",
      format: (v) => `${v} km/h`,
    });
    expect(g.tickLabels[0].text).toBe("25 km/h");
    expect(g.tickLabels[0].x).toBeCloseTo(93);
    expect(g.tickLabels[3].y).toBeCloseTo(100 - 100 + 4);
  });
});

describe("resolveGrid", () => {
  it("defaults to solid 1px full opacity theme color", () => {
    const g = resolveGrid({}, "#444");
    expect(g).toEqual({ style: "solid", width: 1, opacity: 1, color: "#444" });
  });

  it("applies overrides and the deprecated gridDash alias", () => {
    const g = resolveGrid(
      { gridStyle: "dotted", gridWidth: 2, gridOpacity: 0.5, gridColor: "#f00" },
      "#444",
    );
    expect(g).toEqual({ style: "dotted", width: 2, opacity: 0.5, color: "#f00" });
    expect(resolveGrid({ gridDash: "dashed" }, "#444").style).toBe("dashed");
    expect(resolveGrid({ gridDash: "solid" }, "#444").style).toBe("solid");
  });

  it("dash helpers", () => {
    expect(gridDashArray("solid")).toBeUndefined();
    expect(gridDashArray("dashed")).toBe("4 3");
    expect(gridDashArray("dotted")).toBe("1 3");
    expect(gridLineDash("dashed")).toEqual([4, 3]);
    expect(gridLineDash("solid")).toEqual([]);
  });
});
