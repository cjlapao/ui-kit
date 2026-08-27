/**
 * <Chart.Bar> — grouped / stacked / percent bars, vertical or horizontal.
 *
 * Stacks are coordinated here via {@link computeStacks} over the sibling
 * series that share this series' stackId (render order = stack order).
 */
import { useEffect, useId, useRef } from "react";
import {
  computeBarGeometry,
  computeStacks,
} from "../../engine/index";
import type { BarGeometry, CategoricalScale } from "../../engine/types";
import { useChart } from "../ChartContext";
import {
  findSeries,
  valueScaleFor,
  seriesDimStyle
} from "../series-common";
import type { BarSeriesProps } from "../props";

interface FrameBar {
  x: number;
  y: number;
  width: number;
  height: number;
}

function frameBars(
  cur: BarGeometry,
  prev: BarGeometry | null,
  p: number,
  orientation: "vertical" | "horizontal",
  full = false,
): FrameBar[] {
  const baseline = cur.baseline;
  return cur.bars.map((b, i) => {
    const old = prev?.bars[i];
    if (!old || p >= 1) {
      // entrance: grow from the baseline (full when the entrance reveal is
      // handled by a fade or a wipe instead of a geometry grow)
      if (prev === null && !full) {
        return orientation === "vertical"
          ? { x: b.x, y: baseline + (b.y - baseline) * p, width: b.width, height: b.height * p }
          : { x: baseline + (b.x - baseline) * p, y: b.y, width: b.width * p, height: b.height };
      }
      return { x: b.x, y: b.y, width: b.width, height: b.height };
    }
    const l = (a: number, b2: number) => a + (b2 - a) * p;
    return {
      x: l(old.x, b.x),
      y: l(old.y, b.y),
      width: l(old.width, b.width),
      height: l(old.height, b.height),
    };
  });
}

export function BarSeries(props: BarSeriesProps<unknown>) {
  const ctx = useChart();
  const { renderer, xScale, progress,
    dataSig, registerDraw, unregisterDraw,hover,
    hoverDim,
    animType,
    area,
    animationsDisabled,
  } = ctx;
  const me = findSeries(ctx, "bar", props.id, props.data, (props as { __chartSeriesToken?: object }).__chartSeriesToken);
  const lastRef = useRef<BarGeometry | null>(null);
  const prevRef = useRef<BarGeometry | null>(null);
  const lastSigRef = useRef<string | null>(null);
  const clipId = useId().replace(/:/g, "");

  let final: BarGeometry | null = null;
  let hidden = false;
  let seriesId = "bar";
  let seriesColor = "#8b5cf6";
  let orientation: "vertical" | "horizontal" = "vertical";

  if (me && xScale && "bandWidth" in xScale) {
    const d = me.descriptor;
    const vs = valueScaleFor(ctx, d);
    hidden = me.hidden;
    seriesId = d.id;
    seriesColor = me.color;
    orientation = d.orientation ?? "vertical";
    const mode = d.barMode ?? "group";
    if (vs) {
      const band = xScale as CategoricalScale;
      const data = d.data;
      const bars = data.map((item, i) => {
        const category = String(d.xAccessor(item, i));
        const value = d.yAccessor ? (d.yAccessor(item, i) ?? 0) : 0;
        return {
          category,
          value: Number.isFinite(value) ? (value as number) : 0,
          offset: 0,
          item,
          index: i,
        };
      });

      if (mode !== "group") {
        // Coordinate the stack with the sibling series in this stackId group.
        const stackId = d.stackId ?? "default";
        const siblings = ctx.series.filter(
          (s) =>
            s.descriptor.type === "bar" &&
            (s.descriptor.stackId ?? "default") === stackId &&
            (s.descriptor.barMode ?? "group") !== "group",
        );
        const myIdx = siblings.findIndex((s) => s.descriptor.id === seriesId);
        if (myIdx >= 0 && siblings.length > 0) {
          const perSeries = siblings.map((s) => {
            const sd = s.descriptor;
            return sd.data.map((item, i) => {
              const v = sd.yAccessor ? sd.yAccessor(item, i) : 0;
              return Number.isFinite(v as number) ? (v as number) : 0;
            });
          });
          const stacks = computeStacks(perSeries, mode === "percent" ? "percent" : "stack");
          const mine = stacks[myIdx];
          if (mine) {
            bars.forEach((b, i) => {
              if (mine[i]) {
                b.offset = mine[i].start;
                b.value = mine[i].end - mine[i].start;
              }
            });
          }
        }
      }

      // Group mode: siblings share each category's band side by side.
      const stackId = d.stackId ?? "default";
      const groupSiblings = ctx.series.filter(
        (s) =>
          s.descriptor.type === "bar" &&
          (s.descriptor.barMode ?? "group") === "group" &&
          (d.stackId === undefined ||
            (s.descriptor.stackId ?? "default") === stackId),
      );
      const groupIndex = groupSiblings.findIndex((s) => s.descriptor.id === seriesId);

      final = computeBarGeometry({
        bars,
        categoryScale: band,
        valueScale: vs,
        mode,
        orientation,
        groupIndex: Math.max(0, groupIndex),
        groupCount: Math.max(1, groupSiblings.length),
      });

      // Stacked/percent: shrink each segment by the pixel gap so the stack
      // reads as separate rounded pills (gap clamped to keep ≥2px bars).
      const gap = mode === "group" ? 0 : d.segmentGap ?? 0;
      if (gap > 0 && final && orientation === "vertical") {
        final = {
          ...final,
          bars: final.bars.map((b) => {
            if (b.height <= gap + 2) return b;
            return { ...b, y: b.y + gap / 2, height: b.height - gap };
          }),
        };
      } else if (gap > 0 && final && orientation === "horizontal") {
        final = {
          ...final,
          bars: final.bars.map((b) => {
            if (b.width <= gap + 2) return b;
            return { ...b, x: b.x + gap / 2, width: b.width - gap };
          }),
        };
      }
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

  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const isEntrance = prevRef.current === null;
      const full = isEntrance && (animType === "fade" || animType === "sweep");
      const bars = frameBars(final!, prevRef.current, st.progress, orientation, full);
      const corner = me?.descriptor.cornerRadius ?? 0;
      c.save();
      if (isEntrance && animType === "sweep") {
        c.beginPath();
        c.rect(area.x, 0, area.width * Math.max(0.001, st.progress), area.y + area.height);
        c.clip();
      }
      if (isEntrance && animType === "fade") {
        c.globalAlpha = Math.max(0.001, st.progress);
      }
      c.fillStyle = seriesColor;
      for (const b of bars) {
        if (b.width <= 0 || b.height <= 0) continue;
        const r = corner > 0 ? Math.min(corner, b.width / 2, b.height / 2) : 0;
        const rr = c as CanvasRenderingContext2D & {
          roundRect?: (x: number, y: number, w: number, h: number, r: number) => void;
        };
        if (r > 0 && typeof rr.roundRect === "function") {
          c.beginPath();
          rr.roundRect(b.x, b.y, b.width, b.height, r);
          c.fill();
        } else {
          c.fillRect(b.x, b.y, b.width, b.height);
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
    seriesColor,
    orientation,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null || renderer !== "svg") return null;
  const entrance = prev === null;
  const full = entrance && (animType === "fade" || animType === "sweep");
  const bars = frameBars(final, prev, progress, orientation, full);
  const p = prev === null ? progress : 1;
  const entranceP = entrance ? (animationsDisabled ? 1 : progress) : 1;
  const corner = me?.descriptor.cornerRadius ?? 0;

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity:
          hidden
            ? 0
            : seriesDimStyle(hover, seriesId, hoverDim) *
              (entrance && animType === "fade" ? Math.max(0.001, entranceP) : 1),
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
      {bars.map((b, i) => {
        const r =
          corner > 0
            ? Math.min(corner, b.width / 2, b.height / 2)
            : 0;
        return (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={Math.max(0, b.width)}
            height={Math.max(0, b.height)}
            rx={r}
            ry={r}
            fill={seriesColor}
            opacity={prev === null && !full ? Math.max(p, 0.001) : 1}
          />
        );
      })}
          </g>
        </>
      ) : (
        bars.map((b, i) => {
          const r =
            corner > 0
              ? Math.min(corner, b.width / 2, b.height / 2)
              : 0;
          return (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={Math.max(0, b.width)}
              height={Math.max(0, b.height)}
              rx={r}
              ry={r}
              fill={seriesColor}
              opacity={prev === null && !full ? Math.max(p, 0.001) : 1}
            />
          );
        })
      )}
    </g>
  );
}
