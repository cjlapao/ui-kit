import { describe, it, expect } from "vitest";
import { computeCandlestickGeometry } from "./candlestick";

const priceScale = (lo: number, hi: number) => ({
  map: (v: number) => 100 * (1 - (v - lo) / (hi - lo)), // inverted
});

describe("computeCandlestickGeometry", () => {
  it("renders up candles with bodies spanning open→close", () => {
    const g = computeCandlestickGeometry({
      data: [{ x: 10, open: 10, high: 12, low: 9, close: 11.5, item: 0, index: 0 }],
      valueScale: priceScale(8, 14),
      bodyWidth: 8,
    });
    const c = g[0];
    expect(c.direction).toBe("up");
    // open=10 < close=11.5 → closeY < openY (inverted axis)
    expect(c.bodyTop).toBeCloseTo(c.closeY);
    expect(c.bodyHeight).toBeCloseTo(c.openY - c.closeY);
    // wick spans high→low exactly
    expect(c.highY).toBeCloseTo(priceScale(8, 14).map(12));
    expect(c.lowY).toBeCloseTo(priceScale(8, 14).map(9));
    expect(c.bodyWidth).toBe(8);
  });

  it("renders down candles the other way", () => {
    const g = computeCandlestickGeometry({
      data: [{ x: 10, open: 11, high: 12, low: 9, close: 10, item: 0, index: 0 }],
      valueScale: priceScale(8, 14),
      bodyWidth: 8,
    });
    expect(g[0].direction).toBe("down");
    // close=10 < open=11 → openY is the higher price = smaller pixel (top)
    expect(g[0].bodyTop).toBeCloseTo(g[0].openY);
  });

  it("clamps doji (open === close) bodies to a minimum height", () => {
    const g = computeCandlestickGeometry({
      data: [{ x: 10, open: 10, high: 12, low: 9, close: 10, item: 0, index: 0 }],
      valueScale: priceScale(8, 14),
      bodyWidth: 8,
    });
    expect(g[0].direction).toBe("flat");
    expect(g[0].bodyHeight).toBeGreaterThanOrEqual(1);
    // centered on the price line
    expect(g[0].bodyTop + g[0].bodyHeight / 2).toBeCloseTo(g[0].openY);
  });
});
