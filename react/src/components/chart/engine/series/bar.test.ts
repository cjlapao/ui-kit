import { describe, it, expect } from "vitest";
import { computeBarGeometry, computeStacks } from "./bar";

const linear = (lo: number, hi: number) => {
  const map = (v: number) => 100 * (1 - (v - lo) / (hi - lo)); // y inverted
  return { map, domain: [lo, hi] as [number, number] };
};

const band = (n: number, range: [number, number] = [0, 400]) => {
  const step = (range[1] - range[0]) / n;
  const bandWidth = step * 0.7;
  return {
    map: (c: string) => Number(c.replace("q", "")) * step + (step - bandWidth) / 2,
    center: (c: string) => Number(c.replace("q", "")) * step + step / 2,
    bandWidth,
  };
};

describe("computeStacks", () => {
  it("stacks positives upward from zero", () => {
    const out = computeStacks(
      [
        [10, 20],
        [5, 10],
      ],
      "stack",
    );
    expect(out[0]).toEqual([
      { start: 0, end: 10 },
      { start: 0, end: 20 },
    ]);
    expect(out[1]).toEqual([
      { start: 10, end: 15 },
      { start: 20, end: 30 },
    ]);
  });

  it("stacks negatives downward from zero", () => {
    const out = computeStacks(
      [
        [-10, 0],
        [5, 0],
      ],
      "stack",
    );
    expect(out[0]).toEqual([{ start: -10, end: 0 }, { start: 0, end: 0 }]);
    expect(out[1]).toEqual([{ start: 0, end: 5 }, { start: 0, end: 0 }]);
  });

  it("percent normalizes each category to 100", () => {
    const out = computeStacks(
      [
        [60, 10],
        [40, 30],
      ],
      "percent",
    );
    expect(out[0][0]).toEqual({ start: 0, end: 60 });
    expect(out[1][0]).toEqual({ start: 60, end: 100 });
    expect(out[0][1]).toEqual({ start: 0, end: 25 });
    expect(out[1][1]).toEqual({ start: 25, end: 100 });
  });

  it("percent with a zero total stays at zero", () => {
    const out = computeStacks([[0], [0]], "percent");
    expect(out[0][0]).toEqual({ start: 0, end: 0 });
  });
});

describe("computeBarGeometry (grouped, vertical)", () => {
  const cats = band(4);
  const vals = linear(0, 100);

  it("places group members side by side within a band", () => {
    const bars = ["q0", "q1", "q2", "q3"].map((c, i) => ({
      category: c,
      value: 50,
      offset: 0,
      item: i,
      index: i,
    }));
    const a = computeBarGeometry({
      bars,
      categoryScale: cats,
      valueScale: vals,
      mode: "group",
      orientation: "vertical",
      groupIndex: 0,
      groupCount: 2,
    });
    const b = computeBarGeometry({
      bars,
      categoryScale: cats,
      valueScale: vals,
      mode: "group",
      orientation: "vertical",
      groupIndex: 1,
      groupCount: 2,
    });
    // series B starts where series A ends (no overlap)
    for (let i = 0; i < a.bars.length; i++) {
      expect(b.bars[i].x).toBeCloseTo(a.bars[i].x + a.bars[i].width);
    }
    // half-band width each
    expect(a.bars[0].width).toBeCloseTo(cats.bandWidth / 2);
    // value 50 of 100 → half the plot height (inverted axis)
    expect(a.bars[0].height).toBeCloseTo(50);
  });
});

describe("computeBarGeometry (stacked, vertical)", () => {
  const cats = band(2);
  const vals = linear(0, 100);

  it("stacked bars sit on their offsets", () => {
    const bars = [
      { category: "q0", value: 30, offset: 0, item: 0, index: 0 },
      { category: "q0", value: 20, offset: 30, item: 0, index: 1 },
    ];
    const g = computeBarGeometry({
      bars,
      categoryScale: cats,
      valueScale: vals,
      mode: "stack",
      orientation: "vertical",
    });
    expect(g.bars[0].y).toBeCloseTo(vals.map(30)); // top = 0+30
    expect(g.bars[0].height).toBeCloseTo(vals.map(0) - vals.map(30));
    expect(g.bars[1].y).toBeCloseTo(vals.map(50)); // top = 30+20
    expect(g.bars[1].height).toBeCloseTo(vals.map(30) - vals.map(50));
  });

  it("negative values extend below the zero baseline", () => {
    const valsNeg = linear(-100, 100);
    const g = computeBarGeometry({
      bars: [{ category: "q0", value: -40, offset: 0, item: 0, index: 0 }],
      categoryScale: cats,
      valueScale: valsNeg,
      mode: "group",
      orientation: "vertical",
    });
    expect(g.bars[0].y).toBeCloseTo(valsNeg.map(0));
    expect(g.bars[0].height).toBeCloseTo(valsNeg.map(-40) - valsNeg.map(0));
  });
});

describe("computeBarGeometry (horizontal)", () => {
  const cats = band(2); // now the y axis
  const vals = linear(0, 100); // now the x axis

  it("transposes rects: x spans the value, y spans the band", () => {
    const g = computeBarGeometry({
      bars: [{ category: "q0", value: 40, offset: 0, item: 0, index: 0 }],
      categoryScale: cats,
      valueScale: vals,
      mode: "group",
      orientation: "horizontal",
    });
    const r = g.bars[0];
    expect(r.width).toBeCloseTo(Math.abs(vals.map(40) - vals.map(0)));
    expect(r.height).toBeCloseTo(cats.bandWidth);
    expect(r.y).toBeCloseTo(cats.map("q0"));
  });
});
