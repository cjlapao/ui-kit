import { describe, expect, it } from "vitest";
import {
  computeFunnelGeometry,
  darkenStage,
  FUNNEL_MAX_STAGES,
  mixHex,
  pointInPolygon,
} from "./funnel";

const AREA = { x: 40, y: 30, width: 600, height: 300 };
const ITEMS = [
  { label: "A", value: 1000 },
  { label: "B", value: 400 },
  { label: "C", value: 100 },
  { label: "D", value: 40 },
];

describe("computeFunnelGeometry", () => {
  it("returns null for empty data", () => {
    expect(computeFunnelGeometry(AREA, [], { colors: ["#000"] })).toBeNull();
    expect(
      computeFunnelGeometry(AREA, [{ label: "A", value: 0 }], {
        colors: ["#000"],
      }),
    ).toBeNull();
  });

  it("caps at 6 stages and keeps widths proportional", () => {
    const items = Array.from({ length: 9 }, (_, i) => ({
      label: `S${i}`,
      value: 1000 - i * 100,
    }));
    const g = computeFunnelGeometry(AREA, items, { colors: ["#888"] })!;
    expect(g.stages.length).toBe(FUNNEL_MAX_STAGES);
    expect(g.stages[0].width).toBeGreaterThan(g.stages[5].width);
    // proportional between two unclamped stages
    const g2 = computeFunnelGeometry(AREA, ITEMS, { colors: ["#888"] })!;
    expect(g2.stages[0].width / g2.stages[1].width).toBeCloseTo(
      1000 / 400,
      3,
    );
  });

  it("clamps small stages to minWidthRatio", () => {
    const items = [
      { label: "A", value: 1000 },
      { label: "B", value: 1 },
    ];
    const g = computeFunnelGeometry(AREA, items, {
      colors: ["#888"],
      minWidthRatio: 0.2,
    })!;
    expect(g.stages[1].width).toBeCloseTo(g.stages[0].width * 0.2, 5);
  });

  it("tiles the area top-to-bottom without overflow", () => {
    const g = computeFunnelGeometry(AREA, ITEMS, {
      colors: ["#888"],
      arrow: false,
    })!;
    expect(g.stages[0].yTop).toBeCloseTo(AREA.y, 5);
    const last = g.stages[g.stages.length - 1];
    expect(last.yBottom).toBeCloseTo(AREA.y + AREA.height, 5);
    for (let i = 1; i < g.stages.length; i++) {
      expect(g.stages[i].yTop).toBeGreaterThan(g.stages[i - 1].yBottom);
    }
    for (const st of g.stages) {
      const xs = st.points.map((p) => p[0]);
      expect(Math.max(...xs)).toBeLessThanOrEqual(AREA.x + AREA.width + 0.5);
      expect(Math.min(...xs)).toBeGreaterThanOrEqual(AREA.x - 0.5);
    }
  });

  it("computes conversions and gap labels", () => {
    const g = computeFunnelGeometry(AREA, ITEMS, { colors: ["#888"] })!;
    expect(g.connectors.length).toBe(ITEMS.length - 1);
    expect(g.connectors[0].conversion).toBeCloseTo(0.4, 5);
    expect(g.connectors[1].conversion).toBeCloseTo(0.25, 5);
    expect(g.connectors[0].labelY).toBeGreaterThan(g.stages[0].yBottom);
    expect(g.connectors[0].labelY).toBeLessThan(g.stages[1].yTop);
  });

  it("arrow toggles and uses the last stage's dark color", () => {
    const g1 = computeFunnelGeometry(AREA, ITEMS, {
      colors: ["#4488ff"],
      arrow: true,
    })!;
    expect(g1.arrow).not.toBeNull();
    expect(g1.arrow!.color).toBe(darkenStage("#4488ff"));
    const g2 = computeFunnelGeometry(AREA, ITEMS, {
      colors: ["#4488ff"],
      arrow: false,
    })!;
    expect(g2.arrow).toBeNull();
  });

  it("resolves per-stage colors", () => {
    const g = computeFunnelGeometry(AREA, ITEMS, {
      colors: ["#a00", "#0a0", "#00a", "#aa0"],
    })!;
    expect(g.stages[2].color).toBe("#00a");
    expect(g.connectors[1].color).toBe(darkenStage("#0a0"));
  });
});

describe("mixHex / darkenStage", () => {
  it("darkens toward the neutral", () => {
    const d = darkenStage("#ffffff");
    expect(d).not.toBe("#ffffff");
    expect(d).toMatch(/^#[0-9a-f]{6}$/i);
  });
  it("passes through non-hex colors", () => {
    expect(mixHex("rgb(1 2 3)", DARK, 0.5)).toBe("rgb(1 2 3)");
  });
});

const DARK = "#0b1220";

describe("pointInPolygon", () => {
  const poly: [number, number][] = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ];
  it("classifies inside/outside", () => {
    expect(pointInPolygon(5, 5, poly)).toBe(true);
    expect(pointInPolygon(15, 5, poly)).toBe(false);
    expect(pointInPolygon(5, -1, poly)).toBe(false);
  });
});
