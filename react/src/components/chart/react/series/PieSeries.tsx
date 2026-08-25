/**
 * <Chart.Pie> — pie / donut / gauge series (d3 pie + arc geometry).
 *
 * Entrance: the whole pie sweeps in (each slice takes its slice of the
 * sweep in data order). Update: per-slice angle interpolation.
 */
import { arc } from "d3-shape";
import { useEffect, useMemo, useRef } from "react";
import {
  computePieGeometry,
  lerp,
  resolveColor,
  DEFAULT_SERIES_PALETTE,
} from "../../engine/index";
import type { PieGeometry } from "../../engine/types";
import { useChart } from "../ChartContext";
import { findSeries } from "../series-common";
import type { PieSeriesProps } from "../props";

const TWO_PI = Math.PI * 2;

/** Slice paths at a given (possibly fractional) sweep progress. */
function sweepPaths(
  geometry: PieGeometry,
  progress: number,
): string[] {
  if (geometry.slices.length === 0) return [];
  const innerR = geometry.innerRadius;
  const outerR = geometry.outerRadius;
  const gen = arc().innerRadius(innerR).outerRadius(outerR);
  const n = geometry.slices.length;
  const totalSweep = geometry.slices.reduce(
    (acc, s) => acc + (s.endAngle - s.startAngle),
    0,
  );
  const base = geometry.slices[0].startAngle;
  return geometry.slices.map((_s, i) => {
    const s0 = base + totalSweep * (i / n) * progress;
    const s1 = base + totalSweep * ((i + 1) / n) * progress;
    return gen({ startAngle: s0, endAngle: Math.max(s0, s1) } as never) ?? "";
  });
}

function interpolatedPaths(
  cur: PieGeometry,
  prev: PieGeometry | null,
  p: number,
): { path: string; index: number }[] {
  if (!prev || p >= 1) {
    return cur.slices.map((s) => ({ path: s.path, index: s.index }));
  }
  const gen = arc()
    .innerRadius(cur.innerRadius)
    .outerRadius(cur.outerRadius);
  const n = Math.min(cur.slices.length, prev.slices.length);
  return cur.slices.map((s, i) => {
    if (i >= n) {
      // entering slice: sweep in from its own start
      const gen2 = arc().innerRadius(cur.innerRadius).outerRadius(cur.outerRadius);
      return {
        index: i,
        path:
          gen2({
            startAngle: s.startAngle,
            endAngle: lerp(s.startAngle, s.endAngle, p),
            innerRadius: cur.innerRadius,
            outerRadius: cur.outerRadius,
            padAngle: 0,
          } as never) ?? "",
      };
    }
    const old = prev.slices[i];
    return {
      index: i,
      path:
        gen({
          startAngle: lerp(old.startAngle, s.startAngle, p),
          endAngle: lerp(old.endAngle, s.endAngle, p),
          innerRadius: lerp(prev.innerRadius, cur.innerRadius, p),
          outerRadius: lerp(prev.outerRadius, cur.outerRadius, p),
          padAngle: 0,
        } as never) ?? "",
    };
  });
}

export function PieSeries(props: PieSeriesProps<unknown>) {
  const ctx = useChart();
  const { renderer, area, progress, registerDraw, unregisterDraw } = ctx;
  const me = findSeries(ctx, "pie", props.id, props.data);
  const lastRef = useRef<PieGeometry | null>(null);
  const prevRef = useRef<PieGeometry | null>(null);

  // Per-slice colors: colors[] > single color > palette (by slice index).
  const sliceColors = useMemo(() => {
    if (!me) return [] as string[];
    return props.data.map((_item, i) => {
      const input =
        props.colors && props.colors.length > 0
          ? props.colors[i % props.colors.length]
          : props.color;
      return resolveColor(
        input,
        props.colors && props.colors.length > 0 ? i : me.descriptor.paletteIndex,
        DEFAULT_SERIES_PALETTE,
      ).base;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, props.colors, props.color, props.data]);

  let final: PieGeometry | null = null;
  let hidden = false;
  let seriesId = "pie";
  let baseColor = "#8b5cf6";

  if (me) {
    const d = me.descriptor;
    const cx = area.x + area.width / 2;
    const cy = area.y + area.height / 2;
    const outerRadius = Math.min(area.width, area.height) / 2 - 8;
    hidden = me.hidden;
    seriesId = d.id;
    baseColor = me.color;
    final = computePieGeometry({
      items: d.data.map((item, i) => ({
        value: d.valueField ? d.valueField(item, i) : 0,
        item,
      })),
      innerRadiusRatio: d.innerRadius ?? 0,
      startAngle: d.pieStartAngle ?? 0,
      sweepAngle: d.pieSweepAngle ?? TWO_PI,
      cx,
      cy,
      outerRadius: Math.max(10, outerRadius),
    });
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
      const paths =
        prevRef.current === null
          ? sweepPaths(final!, st.progress)
          : interpolatedPaths(final!, prevRef.current, st.progress).map(
              (x) => x.path,
            );
      c.save();
      paths.forEach((path, i) => {
        if (!path) return;
        c.fillStyle = sliceColors[i] ?? baseColor;
        c.fill(new Path2D(path));
      });
      c.restore();
    };
    registerDraw(id, fn);
    return () => unregisterDraw(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    renderer,
    final,
    hidden,
    seriesId,
    baseColor,
    sliceColors,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null) return null;

  if (renderer !== "svg") return null;
  const paths: { path: string }[] =
    prev === null
      ? sweepPaths(final, progress).map((p) => ({ path: p }))
      : interpolatedPaths(final, prev, progress);
  const hoveredIndex =
    ctx.hover &&
    ctx.hover.items[0]?.seriesId === seriesId &&
    !hidden
      ? final.slices.findIndex(
          (s) => s.item === ctx.hover!.items[0].item,
        )
      : -1;

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: hidden ? 0 : 1,
        transition: "opacity 250ms ease",
      }}
    >
      {final.slices.map((s, i) => {
        const path = paths[i]?.path ?? s.path;
        const isHovered = i === hoveredIndex;
        const off = isHovered ? s.popOffset : { dx: 0, dy: 0 };
        return (
          <path
            key={i}
            d={path}
            fill={sliceColors[i] ?? baseColor}
            transform={isHovered ? `translate(${off.dx} ${off.dy})` : undefined}
            style={{ transition: "transform 150ms ease" }}
          />
        );
      })}
      {typeof props.children === "string" && (
        <text
          x={final.cx}
          y={final.cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill={ctx.theme.titleText}
          fontSize={16}
          fontWeight={600}
        >
          {props.children}
        </text>
      )}
    </g>
  );
}
