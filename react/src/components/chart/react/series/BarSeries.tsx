/**
 * <Chart.Bar> — grouped / stacked / percent bars, vertical or horizontal.
 *
 * Stacks are coordinated here via {@link computeStacks} over the sibling
 * series that share this series' stackId (render order = stack order).
 */
import { useEffect, useRef } from "react";
import {
  computeBarGeometry,
  computeStacks,
} from "../../engine/index";
import type { BarGeometry, CategoricalScale } from "../../engine/types";
import { useChart } from "../ChartContext";
import { findSeries, valueScaleFor } from "../series-common";
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
): FrameBar[] {
  const baseline = cur.baseline;
  return cur.bars.map((b, i) => {
    const old = prev?.bars[i];
    if (!old || p >= 1) {
      // entrance: grow from the baseline
      if (prev === null) {
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
  const { renderer, xScale, progress, registerDraw, unregisterDraw } = ctx;
  const me = findSeries(ctx, "bar", props.id, props.data, (props as { __chartSeriesToken?: object }).__chartSeriesToken);
  const lastRef = useRef<BarGeometry | null>(null);
  const prevRef = useRef<BarGeometry | null>(null);

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
    }
  }

  if (lastRef.current !== final) {
    prevRef.current = lastRef.current;
    lastRef.current = final;
  }
  const prev = prevRef.current;

  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const bars = frameBars(final!, prevRef.current, st.progress, orientation);
      c.save();
      c.fillStyle = seriesColor;
      for (const b of bars) {
        if (b.width <= 0 || b.height <= 0) continue;
        c.fillRect(b.x, b.y, b.width, b.height);
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
  const bars = frameBars(final, prev, progress, orientation);
  const p = prev === null ? progress : 1;

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: hidden ? 0 : 1,
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={Math.max(0, b.width)}
          height={Math.max(0, b.height)}
          fill={seriesColor}
          opacity={prev === null ? Math.max(p, 0.001) : 1}
        />
      ))}
    </g>
  );
}
