/**
 * Candlestick / OHLC geometry.
 */
import type { CandleGeometry } from "../types";

export interface CandleInput {
  /** Pixel x (center of the period). */
  x: number;
  open: number;
  high: number;
  low: number;
  close: number;
  item: unknown;
  index: number;
}

export interface CandlestickGeometryInput {
  data: CandleInput[];
  /** Value scale (price axis). */
  valueScale: { map(v: number): number };
  /** Body width in px. */
  bodyWidth: number;
}

const MIN_BODY_PX = 1;

export function computeCandlestickGeometry(
  input: CandlestickGeometryInput,
): CandleGeometry[] {
  const { data, valueScale, bodyWidth } = input;

  return data.map((d) => {
    const openY = valueScale.map(d.open);
    const closeY = valueScale.map(d.close);
    const highY = valueScale.map(d.high);
    const lowY = valueScale.map(d.low);
    const direction: CandleGeometry["direction"] =
      d.close > d.open ? "up" : d.close < d.open ? "down" : "flat";

    let bodyTop = Math.min(openY, closeY);
    let bodyHeight = Math.abs(closeY - openY);
    if (bodyHeight < MIN_BODY_PX) {
      bodyHeight = MIN_BODY_PX;
      bodyTop = (openY + closeY) / 2 - bodyHeight / 2;
    }

    return {
      x: d.x,
      openY,
      highY,
      lowY,
      closeY,
      bodyTop,
      bodyHeight,
      direction,
      item: d.item,
      index: d.index,
      bodyWidth,
    };
  });
}
