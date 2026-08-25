/**
 * <Chart.Candlestick> — OHLC candles, hollow candles, or OHLC bars.
 *
 * Entrance: candles grow from the value-axis baseline; update: per-candle
 * y interpolation.
 */
import { useEffect, useRef } from "react";
import {
  computeCandlestickGeometry,
  lerp,
  resolveColor,
} from "../../engine/index";
import type { CandleGeometry } from "../../engine/types";
import { useChart } from "../ChartContext";
import { findSeries, valueScaleFor } from "../series-common";
import type { CandlestickSeriesProps } from "../props";

const UP_DEFAULT = "emerald";
const DOWN_DEFAULT = "red";

function frameCandles(
  cur: CandleGeometry[],
  prev: CandleGeometry[] | null,
  p: number,
  baselineY: number,
): CandleGeometry[] {
  return cur.map((c, i) => {
    const old = prev?.[i];
    if (!old || p >= 1) {
      if (prev === null) {
        const y = (v: number) => baselineY + (v - baselineY) * p;
        return { ...c, openY: y(c.openY), highY: y(c.highY), lowY: y(c.lowY), closeY: y(c.closeY), bodyTop: y(c.bodyTop), bodyHeight: c.bodyHeight * p };
      }
      return c;
    }
    const l = (a: number, b: number) => lerp(a, b, p);
    return {
      ...c,
      x: l(old.x, c.x),
      openY: l(old.openY, c.openY),
      highY: l(old.highY, c.highY),
      lowY: l(old.lowY, c.lowY),
      closeY: l(old.closeY, c.closeY),
      bodyTop: l(old.bodyTop, c.bodyTop),
      bodyHeight: l(old.bodyHeight, c.bodyHeight),
    };
  });
}

export function CandlestickSeries(props: CandlestickSeriesProps<unknown>) {
  const ctx = useChart();
  const { renderer, xScale, area, progress, registerDraw, unregisterDraw } =
    ctx;
  const me = findSeries(ctx, "candlestick", props.id, props.data, (props as { __chartSeriesToken?: object }).__chartSeriesToken);
  const lastRef = useRef<CandleGeometry[] | null>(null);
  const prevRef = useRef<CandleGeometry[] | null>(null);

  let final: CandleGeometry[] | null = null;
  let hidden = false;
  let seriesId = "candlestick";
  let variant: "candle" | "hollow" | "ohlc" = "candle";
  let upColor = "#34d399";
  let downColor = "#f87171";

  if (me && xScale) {
    const d = me.descriptor;
    const vs = valueScaleFor(ctx, d);
    hidden = me.hidden;
    seriesId = d.id;
    variant = d.candleVariant ?? "candle";
    upColor = resolveColor(props.color?.up ?? UP_DEFAULT, 0).base;
    downColor = resolveColor(props.color?.down ?? DOWN_DEFAULT, 0).base;
    if (vs) {
      // Body width: explicit > 60% of the available step.
      const n = d.data.length;
      const step = n > 1 ? area.width / n : area.width / 10;
      const bodyWidth = d.candleBodyWidth ?? Math.min(step * 0.6, 14);
      final = computeCandlestickGeometry({
        data: d.data.map((item, i) => {
          const rawX = d.xAccessor(item, i);
          return {
            x: xScale.map(rawX as never),
            open: d.openAccessor ? d.openAccessor(item, i) : 0,
            high: d.highAccessor ? d.highAccessor(item, i) : 0,
            low: d.lowAccessor ? d.lowAccessor(item, i) : 0,
            close: d.closeAccessor ? d.closeAccessor(item, i) : 0,
            item,
            index: i,
          };
        }),
        valueScale: vs,
        bodyWidth,
      });
    }
  }

  // Bookkeeping on settled renders only — keeps `prev` the previous settled
  // geometry (null during the entrance) so the entrance stays visible.
  if (progress >= 1 && lastRef.current !== final) {
    prevRef.current = lastRef.current;
    lastRef.current = final;
  }
  const prev = progress < 1 ? prevRef.current : null;
  const baselineY = area.y + area.height;

  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const candles = frameCandles(
        final!,
        prevRef.current,
        st.progress,
        baselineY,
      );
      c.save();
      for (const k of candles) {
        const up = k.direction !== "down";
        const color = up ? upColor : downColor;
        if (variant === "ohlc") {
          c.strokeStyle = color;
          c.lineWidth = 1.5;
          c.beginPath();
          c.moveTo(k.x, k.highY);
          c.lineTo(k.x, k.lowY);
          c.moveTo(k.x - k.bodyWidth / 2, k.openY);
          c.lineTo(k.x, k.openY);
          c.moveTo(k.x, k.closeY);
          c.lineTo(k.x + k.bodyWidth / 2, k.closeY);
          c.stroke();
          continue;
        }
        // wick
        c.strokeStyle = color;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(k.x, k.highY);
        c.lineTo(k.x, k.lowY);
        c.stroke();
        // body
        const bw = k.bodyWidth;
        if (variant === "hollow" && k.direction === "up") {
          c.fillStyle = "#ffffff10";
          c.strokeStyle = color;
          c.lineWidth = 1.5;
          c.fillRect(k.x - bw / 2, k.bodyTop, bw, Math.max(k.bodyHeight, 1));
          c.strokeRect(k.x - bw / 2, k.bodyTop, bw, Math.max(k.bodyHeight, 1));
        } else {
          c.fillStyle = color;
          c.fillRect(k.x - bw / 2, k.bodyTop, bw, Math.max(k.bodyHeight, 1));
        }
      }
      c.restore();
    };
    registerDraw(id, fn);
    return () => unregisterDraw(id);
  }, [
    renderer,
    final,
    hidden,
    seriesId,
    variant,
    upColor,
    downColor,
    baselineY,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null || renderer !== "svg") return null;
  const candles = frameCandles(final, prev, progress, baselineY);

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: hidden ? 0 : 1,
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      {candles.map((k) => {
        const up = k.direction !== "down";
        const color = up ? upColor : downColor;
        if (variant === "ohlc") {
          return (
            <g key={k.index}>
              <line x1={k.x} y1={k.highY} x2={k.x} y2={k.lowY} stroke={color} strokeWidth={1.5} />
              <line x1={k.x - k.bodyWidth / 2} y1={k.openY} x2={k.x} y2={k.openY} stroke={color} strokeWidth={1.5} />
              <line x1={k.x} y1={k.closeY} x2={k.x + k.bodyWidth / 2} y2={k.closeY} stroke={color} strokeWidth={1.5} />
            </g>
          );
        }
        return (
          <g key={k.index}>
            <line
              x1={k.x}
              y1={k.highY}
              x2={k.x}
              y2={k.lowY}
              stroke={color}
              strokeWidth={1}
            />
            {variant === "hollow" && k.direction === "up" ? (
              <rect
                x={k.x - k.bodyWidth / 2}
                y={k.bodyTop}
                width={k.bodyWidth}
                height={Math.max(k.bodyHeight, 1)}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
              />
            ) : (
              <rect
                x={k.x - k.bodyWidth / 2}
                y={k.bodyTop}
                width={k.bodyWidth}
                height={Math.max(k.bodyHeight, 1)}
                fill={color}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
