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

  it("caps at 6 stages and keeps widths ordered", () => {
    const items = Array.from({ length: 9 }, (_, i) => ({
      label: `S${i}`,
      value: 1000 - i * 100,
    }));
    const g = computeFunnelGeometry(AREA, items, { colors: ["#888"] })!;
    expect(g.stages.length).toBe(FUNNEL_MAX_STAGES);
    expect(g.stages[0].width).toBeGreaterThan(g.stages[5].width);
    for (let i = 1; i < g.stages.length; i++) {
      expect(g.stages[i].width).toBeLessThanOrEqual(
        g.stages[i - 1].width + 0.001,
      );
    }
  });

  it("linear scale keeps widths strictly proportional", () => {
    const g = computeFunnelGeometry(AREA, ITEMS, {
      colors: ["#888"],
      scale: "linear",
    })!;
    expect(g.stages[0].width / g.stages[1].width).toBeCloseTo(1000 / 400, 3);
  });

  it("log scale keeps steep funnels legible and distinct", () => {
    const steep = [
      { label: "A", value: 3_600_000 },
      { label: "B", value: 83_100 },
      { label: "C", value: 871 },
      { label: "D", value: 71 },
    ];
    const g = computeFunnelGeometry(AREA, steep, { colors: ["#888"] })!;
    // 83.1K is 2.3% of the max — linear would clamp it to the minimum;
    // log keeps it far above the clamp.
    const minW = g.stages[0].width * 0.22;
    expect(g.stages[1].width).toBeGreaterThan(minW);
    // every step is visibly distinct (no equal-width tail)
    for (let i = 1; i < g.stages.length; i++) {
      expect(g.stages[i - 1].width).toBeGreaterThan(g.stages[i].width);
    }
    // and the top stage is exactly the max width
    expect(g.stages[0].width).toBeCloseTo(g.maxW, 5);
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

  it("keeps % labels outside the connector's slanted edge", () => {
    // Steep funnel: first connector tapers from the full width to the
    // clamped minimum — the label must clear the edge at its own y.
    const steep = [
      { label: "A", value: 1000 },
      { label: "B", value: 10 },
      { label: "C", value: 1 },
    ];
    const g = computeFunnelGeometry(AREA, steep, { colors: ["#888"] })!;
    for (const cn of g.connectors) {
      const [tl, tr, br, bl] = cn.points;
      const edgeXAtLabelY =
        (Math.max(tr[0], tl[0]) + Math.max(br[0], bl[0])) / 2;
      expect(cn.labelX).toBeGreaterThan(edgeXAtLabelY);
      // and the label must not sit inside the polygon
      expect(pointInPolygon(cn.labelX, cn.labelY, cn.points)).toBe(false);
    }
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
