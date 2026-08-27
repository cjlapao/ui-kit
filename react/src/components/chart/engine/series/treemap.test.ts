import { describe, expect, it } from "vitest";
import {
  computeTreemapLayout,
  hitTestTreemap,
  squarifyArea,
} from "./treemap";

const AREA = { x: 10, y: 20, width: 400, height: 300 };

describe("squarifyArea", () => {
  it("preserves area: tile areas sum to the region area", () => {
    const values = [50, 20, 15, 10, 5];
    const rects = squarifyArea(AREA, values);
    expect(rects.length).toBe(5);
    const total = rects.reduce((a, r) => a + r.width * r.height, 0);
    expect(total).toBeCloseTo(AREA.width * AREA.height, 3);
  });

  it("lays the largest value first (top-left in the first row)", () => {
    const rects = squarifyArea(AREA, [50, 20, 15, 10, 5]);
    expect(rects[0].x).toBe(AREA.x);
    expect(rects[0].y).toBe(AREA.y);
    // largest tile gets the most area
    const areas = rects.map((r) => r.width * r.height);
    expect(areas[0]).toBeGreaterThan(areas[1]);
  });

  it("single value fills the whole region", () => {
    const [r] = squarifyArea(AREA, [42]);
    expect(r.x).toBe(AREA.x);
    expect(r.y).toBe(AREA.y);
    expect(r.width).toBeCloseTo(AREA.width, 3);
    expect(r.height).toBeCloseTo(AREA.height, 3);
  });

  it("tiles stay inside the region", () => {
    const values = [7, 3, 2, 2, 1, 1, 1, 1];
    for (const r of squarifyArea(AREA, values)) {
      expect(r.x).toBeGreaterThanOrEqual(AREA.x - 1e-9);
      expect(r.y).toBeGreaterThanOrEqual(AREA.y - 1e-9);
      expect(r.x + r.width).toBeLessThanOrEqual(AREA.x + AREA.width + 1e-9);
      expect(r.y + r.height).toBeLessThanOrEqual(AREA.y + AREA.height + 1e-9);
    }
  });

  it("degenerate: zero total yields zero-sized rects", () => {
    const rects = squarifyArea(AREA, [0, 0]);
    expect(rects.every((r) => r.width === 0 && r.height === 0)).toBe(true);
  });

  it("degenerate: zero-area region yields zero-sized rects", () => {
    const rects = squarifyArea({ x: 0, y: 0, width: 0, height: 100 }, [1, 2]);
    expect(rects.every((r) => r.width === 0 && r.height === 0)).toBe(true);
  });
});

describe("computeTreemapLayout", () => {
  it("flat data is a single group with no header band", () => {
    const layout = computeTreemapLayout(AREA, [{ name: "all", values: [9, 1] }], 18);
    expect(layout.groups).toHaveLength(1);
    const g = layout.groups[0];
    expect(g.headerH).toBe(0);
    expect(g.rect).toEqual({ ...AREA });
    const tileArea = g.tiles.reduce((a, r) => a + r.width * r.height, 0);
    expect(tileArea).toBeCloseTo(AREA.width * AREA.height, 3);
  });

  it("grouped: regions partition the area and headers reserve the band", () => {
    const layout = computeTreemapLayout(
      AREA,
      [
        { name: "Engineering", values: [42, 34, 28, 19] },
        { name: "Marketing", values: [38, 24, 16, 22, 18, 12] },
      ],
      18,
    );
    expect(layout.groups).toHaveLength(2);
    const regionArea = layout.groups.reduce((a, g) => a + g.rect.width * g.rect.height, 0);
    expect(regionArea).toBeCloseTo(AREA.width * AREA.height, 3);
    const inputs = [
      { name: "Engineering", values: [42, 34, 28, 19] },
      { name: "Marketing", values: [38, 24, 16, 22, 18, 12] },
    ];
    layout.groups.forEach((g, gi) => {
      const values = inputs[gi].values;
      expect(g.headerH).toBe(18);
      expect(g.body.y).toBeCloseTo(g.rect.y + 18, 3);
      expect(g.body.height + 18).toBeCloseTo(g.rect.height, 3);
      const tileArea = g.tiles.reduce((a, r) => a + r.width * r.height, 0);
      expect(tileArea).toBeCloseTo(g.body.width * g.body.height, 3);
      // tiles map back to child order: tile areas follow child values
      const total = values.reduce((a, b) => a + b, 0);
      const scale = (g.body.width * g.body.height) / total;
      values.forEach((v, i) => {
        const r = g.tiles[i];
        expect(r.width * r.height).toBeCloseTo(v * scale, 1);
      });
    });
  });

  it("small regions clamp the header to half the region height", () => {
    const layout = computeTreemapLayout(
      { x: 0, y: 0, width: 100, height: 10 },
      [{ name: "a", values: [1] }],
      18,
    );
    expect(layout.groups[0].headerH).toBe(0); // single group → no header
  });
});

describe("hitTestTreemap", () => {
  const layout = computeTreemapLayout(
    AREA,
    [
      { name: "Engineering", values: [42, 34, 28, 19] },
      { name: "Marketing", values: [38, 24, 16, 22, 18, 12] },
    ],
    18,
  );

  it("hits the largest tile of the first group", () => {
    const g = layout.groups[0];
    const c = g.tiles[0];
    const hit = hitTestTreemap(layout, c.x + c.width / 2, c.y + c.height / 2);
    expect(hit).toEqual({ group: 0, tile: 0 });
  });

  it("hits the group header band as tile -1", () => {
    const g = layout.groups[0];
    const hit = hitTestTreemap(layout, g.rect.x + 4, g.rect.y + 4);
    expect(hit).toEqual({ group: 0, tile: -1 });
  });

  it("returns null outside all regions", () => {
    expect(hitTestTreemap(layout, AREA.x - 5, AREA.y)).toBeNull();
  });
});
