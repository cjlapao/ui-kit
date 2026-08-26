/**
 * <Chart.Waterfall> — bridge/waterfall chart: delta steps that accumulate
 * a running total, with total steps anchored at zero.
 *
 * Geometry is derived from the descriptor's precomputed spans (running
 * totals), so the y-domain (root) and the bars (here) agree exactly.
 */
import { useEffect, useRef } from "react";
import type { CategoricalScale, ContinuousScale } from "../../engine/types";
import { useChart } from "../ChartContext";
import { valueScaleFor, seriesDimStyle } from "../series-common";
import type { WaterfallSeriesProps } from "../props";

const DEFAULT_UP = "#10b981";
const DEFAULT_DOWN = "#f43f5e";
const DEFAULT_TOTAL = "#818cf8";

interface WfBar {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  kind: "total" | "up" | "down";
  delta: number;
  category: string;
  index: number;
  item: unknown;
  /** Stacked layer segments in value space (null when unlayered). */
  layers: { start: number; end: number; color: string; name: string }[] | null;
}

interface GrownBar {
  x: number;
  y: number;
  w: number;
  h: number;
}

function defaultLabel(v: number): string {
  return `${v > 0 ? "+" : ""}${Number.isInteger(v) ? v : v.toFixed(2)}`;
}

export function WaterfallSeries(props: WaterfallSeriesProps<unknown>) {
  const ctx = useChart();
  const {
    renderer,
    xScale,
    progress,
    dataSig,
    registerDraw,
    unregisterDraw,
    hover,
    hoverDim,
    animType,
    animationsDisabled,
    theme,
  } = ctx;

  const me = ctx.series.find(
    (s) =>
      s.descriptor.type === "waterfall" &&
      (props.id === undefined || s.descriptor.id === props.id),
  );
  const lastRef = useRef<{ key: string; bars: WfBar[] } | null>(null);
  const prevRef = useRef<{ key: string; bars: WfBar[] } | null>(null);
  const lastSigRef = useRef<string | null>(null);

  const d = me?.descriptor;
  const hidden = me?.hidden ?? false;
  const seriesId = d?.id ?? "waterfall";
  const orientation: "vertical" | "horizontal" =
    d?.waterfallOrientation ?? "vertical";
  const horizontal = orientation === "horizontal";
  const showLabels = d?.waterfallValueLabels ?? true;
  const labelFmt =
    d?.waterfallValueLabelFormat ?? ((v: number) => defaultLabel(v));
  const corner = d?.waterfallCornerRadius ?? 0;
  const vs = d ? valueScaleFor(ctx, d) : null;
  // Categories ride the x scale (vertical) or the band y scale (transposed).
  const bandSource = ctx.transposed ? ctx.yScale : xScale;
  const band =
    vs && bandSource && "bandWidth" in bandSource
      ? (bandSource as CategoricalScale)
      : null;

  let final: WfBar[] | null = null;
  if (d && band && vs) {
    final = d.data.map((item, i) => {
      const spans = d.waterfallSpans?.[i] ?? [0, 0];
      const [lo, hi] = spans;
      const delta = d.yAccessor ? (d.yAccessor(item, i) ?? 0) : 0;
      const kind = d.waterfallKinds?.[i] ?? (delta < 0 ? "down" : "up");
      const layers = d.waterfallLayers?.[i]?.length
        ? d.waterfallLayers[i]
        : null;
      const baseColor =
        (d.waterfallColorAccessor
          ? d.waterfallColorAccessor(item, i)
          : undefined) ??
        (kind === "total"
          ? d.waterfallColors?.total ?? DEFAULT_TOTAL
          : kind === "down"
            ? d.waterfallColors?.down ?? DEFAULT_DOWN
            : d.waterfallColors?.up ?? DEFAULT_UP);

      const category = String(d.xAccessor(item, i));
      const map = (v: number) => (vs as ContinuousScale).map(v);
      let x: number;
      let y: number;
      let width: number;
      let height: number;
      // Normalized rect: the step spans lo→hi in value space; pixels
      // depend on the sign of the delta (negative steps point down/left).
      if (!horizontal) {
        const a = map(lo);
        const z = map(hi);
        x = band.map(category);
        width = band.bandWidth;
        y = Math.min(a, z);
        height = Math.abs(a - z);
      } else {
        const a = map(lo);
        const z = map(hi);
        y = band.map(category);
        height = band.bandWidth;
        x = Math.min(a, z);
        width = Math.abs(a - z);
      }

      // Layer segments in value space; the primary layer rides the lo
      // (baseline) edge, so negative steps stack down from the hi edge.
      let layerRects: WfBar["layers"] = null;
      if (layers) {
        // The primary layer rides the start (lo) edge; each layer extends
        // in the direction of its own (signed) value.
        let cursor = lo;
        layerRects = layers.map((l) => {
          const start = cursor;
          cursor += l.value;
          return { start, end: cursor, color: l.color ?? baseColor, name: l.name };
        });
      }

      return {
        x,
        y,
        width,
        height,
        color: baseColor,
        kind,
        delta,
        category,
        index: i,
        item,
        layers: layerRects,
      };
    });
  }

  // Bookkeeping: capture the settled geometry so data changes morph.
  if (progress >= 1 && final !== null) {
    if (lastSigRef.current !== dataSig && lastRef.current) {
      prevRef.current = lastRef.current;
    }
    lastRef.current = { key: seriesId, bars: final };
    lastSigRef.current = dataSig;
  }
  const prev =
    progress < 1 && prevRef.current?.key === seriesId
      ? prevRef.current.bars
      : null;

  const p = prev === null ? (animationsDisabled ? 1 : progress) : 1;

  // Grow a bar from its lo edge (value space) by `prog`.
  const growAt = (b: WfBar, prog: number): GrownBar => {
    if (!d || !vs) return { x: b.x, y: b.y, w: b.width, h: b.height };
    const map = (v: number) => (vs as ContinuousScale).map(v);
    // The bar grows from its start (lo) edge toward hi: up when hi > lo
    // (vertical), right when hi > lo (horizontal).
    const lo = d.waterfallSpans?.[b.index]?.[0] ?? 0;
    const hi = d.waterfallSpans?.[b.index]?.[1] ?? 0;
    if (!horizontal) {
      const loY = map(lo);
      const h = b.height * prog;
      return hi >= lo
        ? { x: b.x, y: loY - h, w: b.width, h }
        : { x: b.x, y: loY, w: b.width, h };
    }
    const loX = map(lo);
    const w = b.width * prog;
    return hi >= lo
      ? { x: loX, y: b.y, w, h: b.height }
      : { x: loX - w, y: b.y, w, h: b.height };
  };

  interface GrownFull extends WfBar {
    w: number;
    h: number;
  }
  const growFrame = (b: WfBar, prog: number): GrownFull => {
    if (prev !== null) {
      const old = prev[b.index];
      const l = (a: number, c: number) => a + (c - a) * prog;
      return {
        ...b,
        x: l(old.x, b.x),
        y: l(old.y, b.y),
        w: l(old.width, b.width),
        h: l(old.height, b.height),
      };
    }
    const g = growAt(b, prog);
    return { ...b, x: g.x, y: g.y, w: g.w, h: g.h };
  };

  const drawConnectors = (
    c: CanvasRenderingContext2D,
    bars: GrownBar[],
    prog: number,
  ) => {
    if (!d || !vs) return;
    const map = (v: number) => (vs as ContinuousScale).map(v);
    c.save();
    c.strokeStyle = theme.subtleText;
    c.globalAlpha = Math.max(0.001, prog) * 0.5;
    c.lineWidth = 1;
    c.setLineDash([3, 3]);
    for (let i = 0; i < bars.length - 1; i++) {
      const b = bars[i];
      const n = bars[i + 1];
      const running = d.waterfallSpans?.[i]?.[1] ?? 0;
      const rp = map(running);
      c.beginPath();
      if (horizontal) {
        c.moveTo(rp, b.y + b.h);
        c.lineTo(rp, n.y);
      } else {
        c.moveTo(b.x + b.w, rp);
        c.lineTo(n.x, rp);
      }
      c.stroke();
    }
    c.restore();
  };

  const drawBars = (
    c: CanvasRenderingContext2D,
    bars: (GrownBar & WfBar)[],
    prog: number,
    isEntrance: boolean,
  ) => {
    c.save();
    if (d?.waterfallConnectors) drawConnectors(c, bars, prog);
    const map = vs ? (v: number) => (vs as ContinuousScale).map(v) : null;
    for (const b of bars) {
      if (b.w <= 0 || b.h <= 0) continue;
      if (b.layers && b.layers.length > 0 && map) {
        for (const seg of b.layers) {
          const a = map(seg.start);
          const z = map(seg.end);
          c.fillStyle = seg.color;
          if (!horizontal)
            c.fillRect(b.x, Math.min(a, z), b.w, Math.abs(a - z));
          else c.fillRect(Math.min(a, z), b.y, Math.abs(a - z), b.h);
        }
        continue;
      }
      c.fillStyle = b.color;
      const r = corner > 0 ? Math.min(corner, b.w / 2, b.h / 2) : 0;
      const rr = c as CanvasRenderingContext2D & {
        roundRect?: (
          x: number,
          y: number,
          w: number,
          h: number,
          r: number,
        ) => void;
      };
      if (r > 0 && typeof rr.roundRect === "function") {
        c.beginPath();
        rr.roundRect(b.x, b.y, b.w, b.h, r);
        c.fill();
      } else {
        c.fillRect(b.x, b.y, b.w, b.h);
      }
    }
    if (showLabels) {
      for (const b of bars) {
        c.globalAlpha = isEntrance ? Math.max(0.001, prog) : 1;
        c.fillStyle = theme.titleText;
        c.font = "600 11px sans-serif";
        const label = labelFmt(b.delta, b.item, b.index);
        const above = b.delta >= 0 || b.kind === "total";
        if (!horizontal) {
          c.textAlign = "center";
          c.textBaseline = above ? "bottom" : "top";
          c.fillText(label, b.x + b.w / 2, above ? b.y - 5 : b.y + b.h + 5);
        } else {
          c.textAlign = above ? "left" : "right";
          c.textBaseline = "middle";
          c.fillText(
            label,
            above ? b.x + b.w + 6 : b.x - 6,
            b.y + b.h / 2,
          );
        }
      }
    }
    c.restore();
  };

  // ── Canvas ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const isEntrance = prev === null;
      const prog = isEntrance ? (animationsDisabled ? 1 : st.progress) : 1;
      drawBars(c, final.map((b) => growFrame(b, prog)), prog, isEntrance);
    };
    registerDraw(id, fn);
    return () => unregisterDraw(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    renderer,
    final,
    hidden,
    seriesId,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null || renderer !== "svg" || !d || !vs) return null;

  const map = (v: number) => (vs as ContinuousScale).map(v);
  const bars = final.map((b) => {
    const g =
      prev === null ? growAt(b, p) : growFrame(b, p);
    return { ...b, x: g.x, y: g.y, width: g.w, height: g.h };
  });
  const entranceOp = Math.max(prev === null ? p : 1, 0.001);

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: hidden
          ? 0
          : seriesDimStyle(hover, seriesId, hoverDim) *
            (prev === null && animType === "fade"
              ? Math.max(0.001, p)
              : 1),
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      {d.waterfallConnectors &&
        bars.slice(0, -1).map((b, i) => {
          const next = bars[i + 1];
          if (!next) return null;
          const rp = map(d.waterfallSpans?.[b.index]?.[1] ?? 0);
          return horizontal ? (
            <line
              key={`c${i}`}
              x1={rp}
              y1={b.y + b.height}
              x2={rp}
              y2={next.y}
              stroke={theme.subtleText}
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={entranceOp * 0.5}
            />
          ) : (
            <line
              key={`c${i}`}
              x1={b.x + b.width}
              y1={rp}
              x2={next.x}
              y2={rp}
              stroke={theme.subtleText}
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={entranceOp * 0.5}
            />
          );
        })}
      {bars.map((b) => {
        const r =
          corner > 0 ? Math.min(corner, b.width / 2, b.height / 2) : 0;
        if (b.layers && b.layers.length > 0) {
          return (
            <g key={b.index} opacity={entranceOp}>
              {b.layers.map((seg, si) => {
                const a = map(seg.start);
                const z = map(seg.end);
                return horizontal ? (
                  <rect
                    key={si}
                    x={Math.min(a, z)}
                    y={b.y}
                    width={Math.abs(a - z)}
                    height={b.height}
                    fill={seg.color}
                  />
                ) : (
                  <rect
                    key={si}
                    x={b.x}
                    y={Math.min(a, z)}
                    width={b.width}
                    height={Math.abs(a - z)}
                    fill={seg.color}
                  />
                );
              })}
            </g>
          );
        }
        return (
          <rect
            key={b.index}
            x={b.x}
            y={b.y}
            width={Math.max(0, b.width)}
            height={Math.max(0, b.height)}
            rx={r}
            ry={r}
            fill={b.color}
            opacity={entranceOp}
          />
        );
      })}
      {showLabels &&
        bars.map((b) => {
          const label = labelFmt(b.delta, b.item, b.index);
          const above = b.delta >= 0 || b.kind === "total";
          return !horizontal ? (
            <text
              key={`l${b.index}`}
              x={b.x + b.width / 2}
              y={above ? b.y - 5 : b.y + b.height + 5}
              textAnchor="middle"
              dominantBaseline={above ? "auto" : "hanging"}
              fontSize={11}
              fontWeight={600}
              fill={theme.titleText}
              opacity={entranceOp}
            >
              {label}
            </text>
          ) : (
            <text
              key={`l${b.index}`}
              x={above ? b.x + b.width + 6 : b.x - 6}
              y={b.y + b.height / 2}
              textAnchor={above ? "start" : "end"}
              dominantBaseline="central"
              fontSize={11}
              fontWeight={600}
              fill={theme.titleText}
              opacity={entranceOp}
            >
              {label}
            </text>
          );
        })}
    </g>
  );
}
