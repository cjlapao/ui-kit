/**
 * <Chart.Candlestick> — OHLC candles, hollow candles, or OHLC bars.
 *
 * Entrance: candles grow from the value-axis baseline; update: per-candle
 * y interpolation.
 */
import { useEffect, useId, useRef } from "react";
import {
  computeCandlestickGeometry,
  lerp,
  resolveColor,
  shadeColor,
} from "../../engine/index";
import type { CandleGeometry } from "../../engine/types";
import { useChart } from "../ChartContext";
import {
  findSeries,
  valueScaleFor,
  seriesDimStyle
} from "../series-common";
import type { CandlestickSeriesProps } from "../props";

const UP_DEFAULT = "emerald";
const DOWN_DEFAULT = "red";
/** Hover highlight: how much the up/down color blends toward white. */
const LIGHTEN_FACTOR = 0.35;
/** Hover highlight: body-width multiplier, clamped to 90% of the step. */
const GROW_FACTOR = 1.4;

/** Blend a hex color toward white by f (mirror of shadeColor, which darkens). */
function lighten(color: string, f: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return color;
  const n = parseInt(m[1], 16);
  const mix = (ch: number) => Math.round(ch + (255 - ch) * f);
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
}

function frameCandles(
  cur: CandleGeometry[],
  prev: CandleGeometry[] | null,
  p: number,
  baselineY: number,
  full = false,
): CandleGeometry[] {
  return cur.map((c, i) => {
    const old = prev?.[i];
    if (!old || p >= 1) {
      if (prev === null && !full) {
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
  const {
    renderer,
    xScale,
    area,
    progress,
    dataSig,
    hover,
    registerDraw,
    unregisterDraw,hoverDim,
    animType,
    animationsDisabled,
  } = ctx;
  const me = findSeries(ctx, "candlestick", props.id, props.data, (props as { __chartSeriesToken?: object }).__chartSeriesToken);
  const lastRef = useRef<CandleGeometry[] | null>(null);
  const prevRef = useRef<CandleGeometry[] | null>(null);
  const lastSigRef = useRef<string | null>(null);

  let final: CandleGeometry[] | null = null;
  let hidden = false;
  let seriesId = "candlestick";
  let variant: "candle" | "hollow" | "ohlc" = "candle";
  let upColor = "#34d399";
  let downColor = "#f87171";
  let step = 0;
  let highlightOn = true;

  if (me && xScale) {
    const d = me.descriptor;
    const vs = valueScaleFor(ctx, d);
    hidden = me.hidden;
    seriesId = d.id;
    variant = d.candleVariant ?? "candle";
    highlightOn = d.candleHighlightSelected ?? true;
    upColor = resolveColor(props.color?.up ?? UP_DEFAULT, 0).base;
    downColor = resolveColor(props.color?.down ?? DOWN_DEFAULT, 0).base;
    if (vs) {
      // Body width: explicit > 60% of the available step.
      const n = d.data.length;
      step = n > 1 ? area.width / n : area.width / 10;
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
  // Bookkeeping on settled renders only — guarded by the root's data
  // signature (stable across StrictMode's double render) so the previous
  // settled geometry is captured exactly once per data change.
  if (progress >= 1 && final !== null && lastSigRef.current !== dataSig) {
    prevRef.current = lastRef.current;
    lastRef.current = final;
    lastSigRef.current = dataSig;
  }
  const prev = progress < 1 ? prevRef.current : null;
  const baselineY = area.y + area.height;

  // ── Selected-candle highlight (hover only) ────────────────────────────────
  // The root hover already snaps to the nearest candle and carries its close
  // price; match it to a candle by datum identity.
  const hoverItem =
    hover?.items.find((it) => it.seriesId === seriesId) ?? null;
  const hoveredIndex =
    highlightOn && hoverItem && final
      ? final.findIndex((k) => k.item === hoverItem.item)
      : -1;

  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const isEntrance = prevRef.current === null;
      const full =
        isEntrance && (animType === "fade" || animType === "sweep");
      const candles = frameCandles(
        final!,
        prevRef.current,
        st.progress,
        baselineY,
        full,
      );
      c.save();
      if (isEntrance) {
        if (animType === "sweep") {
          c.beginPath();
          c.rect(
            area.x,
            0,
            area.width * Math.max(0.001, st.progress),
            area.y + area.height,
          );
          c.clip();
        }
        if (animType === "fade") {
          c.globalAlpha = Math.max(0.001, st.progress);
        }
      }
      let hovered: CandleGeometry | null = null;
      for (let i = 0; i < candles.length; i++) {
        const k = candles[i];
        const isHover = highlightOn && i === hoveredIndex;
        const up = k.direction !== "down";
        const base = up ? upColor : downColor;
        const color = isHover ? lighten(base, LIGHTEN_FACTOR) : base;
        const bw = isHover ? Math.min(k.bodyWidth * GROW_FACTOR, step * 0.9) : k.bodyWidth;
        if (isHover) hovered = k;
        if (variant === "ohlc") {
          c.strokeStyle = color;
          c.lineWidth = 1.5;
          c.beginPath();
          c.moveTo(k.x, k.highY);
          c.lineTo(k.x, k.lowY);
          c.moveTo(k.x - bw / 2, k.openY);
          c.lineTo(k.x, k.openY);
          c.moveTo(k.x, k.closeY);
          c.lineTo(k.x + bw / 2, k.closeY);
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
      // Close-price pill above the hovered candle's high wick.
      if (hovered && hoverItem) {
        const up = hovered.direction !== "down";
        const text = String(Math.round(hoverItem.value * 10) / 10);
        const w = text.length * 6.4 + 12;
        const h = 17;
        const top = hovered.highY - 8 - h;
        c.fillStyle = shadeColor(up ? upColor : downColor, 0.45);
        c.fillRect(hovered.x - w / 2, top, w, h);
        c.fillStyle = "#fff";
        c.font = "600 11px sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(text, hovered.x, top + h / 2);
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
    highlightOn,
    hoveredIndex,
    hoverItem,
    step,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null || renderer !== "svg") return null;
  const entrance = prev === null;
  const full = entrance && (animType === "fade" || animType === "sweep");
  const candles = frameCandles(final, prev, progress, baselineY, full);
  const entranceP = entrance ? (animationsDisabled ? 1 : progress) : 1;
  const clipId = useId().replace(/:/g, "");

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity:
          hidden
            ? 0
            : seriesDimStyle(hover, seriesId, hoverDim) *
              (entrance && animType === "fade"
                ? Math.max(0.001, entranceP)
                : 1),
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      {entrance && animType === "sweep" ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect
                x={area.x}
                y={0}
                width={area.width * Math.max(0.001, entranceP)}
                height={area.y + area.height}
              />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
          {candles.map((k, i) => {
        const isHover = highlightOn && i === hoveredIndex;
        const up = k.direction !== "down";
        const base = up ? upColor : downColor;
        const color = isHover ? lighten(base, LIGHTEN_FACTOR) : base;
        const bw = isHover ? Math.min(k.bodyWidth * GROW_FACTOR, step * 0.9) : k.bodyWidth;
        if (variant === "ohlc") {
          return (
            <g key={k.index}>
              <line x1={k.x} y1={k.highY} x2={k.x} y2={k.lowY} stroke={color} strokeWidth={1.5} />
              <line x1={k.x - bw / 2} y1={k.openY} x2={k.x} y2={k.openY} stroke={color} strokeWidth={1.5} />
              <line x1={k.x} y1={k.closeY} x2={k.x + bw / 2} y2={k.closeY} stroke={color} strokeWidth={1.5} />
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
                x={k.x - bw / 2}
                y={k.bodyTop}
                width={bw}
                height={Math.max(k.bodyHeight, 1)}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                style={{ transition: "x 150ms ease, width 150ms ease, stroke 150ms ease" }}
              />
            ) : (
              <rect
                x={k.x - bw / 2}
                y={k.bodyTop}
                width={bw}
                height={Math.max(k.bodyHeight, 1)}
                fill={color}
                style={{ transition: "x 150ms ease, width 150ms ease, fill 150ms ease" }}
              />
            )}
          </g>
        );
      })}
          </g>
        </>
      ) : (
        candles.map((k, i) => {
          const isHover = highlightOn && i === hoveredIndex;
          const up = k.direction !== "down";
          const base = up ? upColor : downColor;
          const color = isHover ? lighten(base, LIGHTEN_FACTOR) : base;
          const bw = isHover ? Math.min(k.bodyWidth * GROW_FACTOR, step * 0.9) : k.bodyWidth;
          if (variant === "ohlc") {
            return (
              <g key={k.index}>
                <line x1={k.x} y1={k.highY} x2={k.x} y2={k.lowY} stroke={color} strokeWidth={1.5} />
                <line x1={k.x - bw / 2} y1={k.openY} x2={k.x} y2={k.openY} stroke={color} strokeWidth={1.5} />
                <line x1={k.x} y1={k.closeY} x2={k.x + bw / 2} y2={k.closeY} stroke={color} strokeWidth={1.5} />
              </g>
            );
          }
          return (
            <g key={k.index}>
              <line x1={k.x} y1={k.highY} x2={k.x} y2={k.lowY} stroke={color} strokeWidth={1} />
              {variant === "hollow" && k.direction === "up" ? (
                <rect
                  x={k.x - bw / 2}
                  y={k.bodyTop}
                  width={bw}
                  height={Math.max(k.bodyHeight, 1)}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                />
              ) : (
                <rect
                  x={k.x - bw / 2}
                  y={k.bodyTop}
                  width={bw}
                  height={Math.max(k.bodyHeight, 1)}
                  fill={color}
                />
              )}
            </g>
          );
        })
      )}
      {highlightOn && hoveredIndex >= 0 && hoverItem && (() => {
        const k = candles[hoveredIndex];
        const up = k.direction !== "down";
        const text = String(Math.round(hoverItem.value * 10) / 10);
        const w = text.length * 6.4 + 12;
        const h = 17;
        const top = k.highY - 8 - h;
        return (
          <g pointerEvents="none">
            <rect
              x={k.x - w / 2}
              y={top}
              width={w}
              height={h}
              rx={8.5}
              fill={shadeColor(up ? upColor : downColor, 0.45)}
            />
            <text
              x={k.x}
              y={top + h / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fontWeight={600}
              fill="#fff"
            >
              {text}
            </text>
          </g>
        );
      })()}
    </g>
  );
}
