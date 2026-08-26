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
  shadeColor,
  DEFAULT_SERIES_PALETTE,
} from "../../engine/index";
import type { PieGeometry } from "../../engine/types";
import { useChart } from "../ChartContext";
import {
  findSeries,
  seriesDimStyle
} from "../series-common";
import type { PieSeriesProps } from "../props";

const TWO_PI = Math.PI * 2;

/**
 * Slice paths at a given (possibly fractional) sweep progress. The sweep
 * travels the circle in data order; each slice grows through its own
 * angular window so the reveal follows the real slice sizes.
 */
function sweepPaths(
  geometry: PieGeometry,
  progress: number,
): string[] {
  if (geometry.slices.length === 0) return [];
  const innerR = geometry.innerRadius;
  const outerR = geometry.outerRadius;
  // padAngle/cornerRadius must match the settled (engine) paths — otherwise
  // the reveal ends on a different shape than the engine's final slices.
  const gen = arc()
    .innerRadius(innerR)
    .outerRadius(outerR)
    .padAngle(geometry.padAngle ?? 0)
    .cornerRadius(geometry.cornerRadius ?? 0);
  const totalSweep = geometry.slices.reduce(
    (acc, s) => acc + (s.endAngle - s.startAngle),
    0,
  );
  const base = geometry.slices[0].startAngle;
  let cursor = 0; // cumulative angle before the current slice
  return geometry.slices.map((s) => {
    const span = s.endAngle - s.startAngle;
    const sliceStart = base + cursor;
    const reveal = totalSweep * progress; // how much of the circle is shown
    const shown = Math.max(0, Math.min(reveal - cursor, span));
    cursor += span;
    if (shown <= 0.0001) return "";
    return gen({ startAngle: sliceStart, endAngle: sliceStart + shown } as never) ?? "";
  });
}

/**
 * Per-slice reveal fraction at a given sweep progress (0 = not started,
 * 1 = fully revealed) — drives the per-slice label count-up.
 */
function sliceRevealFractions(geometry: PieGeometry, progress: number): number[] {
  if (geometry.slices.length === 0) return [];
  const totalSweep = geometry.slices.reduce(
    (acc, s) => acc + (s.endAngle - s.startAngle),
    0,
  );
  const reveal = totalSweep * progress;
  let cursor = 0;
  return geometry.slices.map((s) => {
    const span = Math.max(s.endAngle - s.startAngle, 1e-6);
    const frac = Math.max(0, Math.min(1, (reveal - cursor) / span));
    cursor += s.endAngle - s.startAngle;
    return frac;
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
    .outerRadius(cur.outerRadius)
    .padAngle(cur.padAngle ?? 0)
    .cornerRadius(cur.cornerRadius ?? 0);
  const n = Math.min(cur.slices.length, prev.slices.length);
  return cur.slices.map((s, i) => {
    if (i >= n) {
      // entering slice: sweep in from its own start
      const gen2 = arc()
        .innerRadius(cur.innerRadius)
        .outerRadius(cur.outerRadius)
        .padAngle(cur.padAngle ?? 0)
        .cornerRadius(cur.cornerRadius ?? 0);
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
  const {
    renderer,
    area,
    progress,
    registerDraw,
    unregisterDraw,
    hoverDim,
    hover,
  } = ctx;
  const me = findSeries(ctx, "pie", props.id, props.data, (props as { __chartSeriesToken?: object }).__chartSeriesToken);
  const lastRef = useRef<PieGeometry | null>(null);
  const prevRef = useRef<PieGeometry | null>(null);

  // Per-slice colors: colors[] > single color (uniform) > palette (one hue
  // per slice — the pie default).
  const sliceColors = useMemo(() => {
    if (!me) return [] as string[];
    return props.data.map((_item, i) => {
      if (props.colors && props.colors.length > 0) {
        return resolveColor(
          props.colors[i % props.colors.length],
          i,
          DEFAULT_SERIES_PALETTE,
        ).base;
      }
      if (props.color !== undefined) {
        return resolveColor(props.color, i, DEFAULT_SERIES_PALETTE).base;
      }
      return resolveColor(undefined, i, DEFAULT_SERIES_PALETTE).base;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, props.colors, props.color, props.data]);

  const hidden = me?.hidden ?? false;
  const seriesId = me?.descriptor.id ?? "pie";
  const baseColor = me?.color ?? "#8b5cf6";

  // Memoized: `final` feeds the presentation effect (which bumps
  // redrawNonce), so it must be referentially stable across re-renders or
  // the registration loops forever.
  const final: PieGeometry | null = useMemo(() => {
    if (!me) return null;
    const d = me.descriptor;
    const cx = area.x + area.width / 2;
    const cy = area.y + area.height / 2;
    const outerRadius = Math.min(area.width, area.height) / 2 - 8;
    return computePieGeometry({
      items: d.data.map((item, i) => ({
        value: d.valueField ? d.valueField(item, i) : 0,
        item,
      })),
      innerRadiusRatio: d.innerRadius ?? 0,
      startAngle: d.pieStartAngle ?? 0,
      sweepAngle: d.pieSweepAngle ?? TWO_PI,
      padAngle: d.piePadAngle ?? 0,
      cornerRadius: d.pieCornerRadius ?? 0,
      cx,
      cy,
      outerRadius: Math.max(10, outerRadius),
    });
    // me + area are stable across re-renders (descriptor objects and the
    // root's layout memo), so the geometry identity is stable too.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, area]);

  // Bookkeeping on settled renders only — keeps `prev` the previous settled
  // geometry (null during the entrance) so the entrance stays visible.
  if (progress >= 1 && lastRef.current !== final) {
    prevRef.current = lastRef.current;
    lastRef.current = final;
  }
  const prev = progress < 1 ? prevRef.current : null;

  // ── Percentage labels (inside slices, count-up + grow on entrance) ───────
  const pctLabel = (v: number) =>
    (v >= 10 ? String(Math.round(v)) : String(Math.round(v * 10) / 10)) + "%";

  const percentLabels = useMemo(() => {
    if (!final || final.total <= 0 || !me) return [];
    const d = me.descriptor;
    if (!d.piePercentLabels) return [];
    const minPct = d.pieMinPercentLabel ?? 5;
    const rLabel = (final.innerRadius + final.outerRadius) / 2;
    const out: {
      index: number;
      x: number;
      y: number;
      pct: number;
      color: string;
    }[] = [];
    final.slices.forEach((s, i) => {
      const pct = (s.value / final.total) * 100;
      if (pct < minPct) return;
      out.push({
        index: i,
        x: final.cx + Math.sin(s.labelAngle) * rLabel,
        y: final.cy - Math.cos(s.labelAngle) * rLabel,
        pct,
        color: sliceColors[i] ?? baseColor,
      });
    });
    return out;
    // me + final + colors are stable across re-renders (see the final memo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [final, me, sliceColors, baseColor]);

  // Publish per-slice presentation (name/value/color/angle + geometry) for
  // DataLabels and Legend. Registered post-render; the redrawNonce bump
  // re-renders the consumers once the entry exists.
  const piePresentation = useMemo(() => {
    if (!me || !final) return null;
    const d = me.descriptor;
    return {
      cx: final.cx,
      cy: final.cy,
      innerRadius: final.innerRadius,
      outerRadius: final.outerRadius,
      total: final.total,
      slices: final.slices.map((s, i) => ({
        name: String(
          (d.categoryField && d.categoryField(d.data[s.index], s.index)) ??
            (d.valueField ? d.valueField(d.data[s.index], s.index) : i),
        ),
        value: s.value,
        color: sliceColors[i] ?? baseColor,
        labelAngle: s.labelAngle,
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, final, sliceColors, baseColor]);

  useEffect(() => {
    if (!piePresentation) return;
    ctx.piePresentations.set(seriesId, piePresentation);
    ctx.requestRedraw();
    return () => {
      ctx.piePresentations.delete(seriesId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [piePresentation, seriesId]);

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
      c.translate(final.cx, final.cy);
      paths.forEach((path, i) => {
        if (!path) return;
        c.fillStyle = sliceColors[i] ?? baseColor;
        c.fill(new Path2D(path));
      });
      c.restore();
      // Percentage labels: count up + grow in step with each slice's reveal.
      if (percentLabels.length > 0) {
        const entrance = prevRef.current === null;
        const fracs = entrance
          ? sliceRevealFractions(final!, st.progress)
          : percentLabels.map(() => 1);
        c.save();
        c.textAlign = "center";
        c.textBaseline = "middle";
        percentLabels.forEach((lb) => {
          const lp = Math.max(0.001, fracs[lb.index] ?? 0);
          const size = 11 * lp;
          if (size < 2) return;
          const text = pctLabel(lb.pct * lp);
          c.globalAlpha = lp;
          c.font = `600 ${size}px sans-serif`;
          const w = text.length * size * 0.58 + 12 * lp;
          const h = 17 * lp;
          c.fillStyle = shadeColor(lb.color, 0.45);
          if (typeof (c as CanvasRenderingContext2D & { roundRect?: unknown }).roundRect === "function") {
            c.beginPath();
            (c as CanvasRenderingContext2D & { roundRect: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect(lb.x - w / 2, lb.y - h / 2, w, h, h / 2);
            c.fill();
          } else {
            c.fillRect(lb.x - w / 2, lb.y - h / 2, w, h);
          }
          c.fillStyle = "#fff";
          c.fillText(text, lb.x, lb.y + 0.5);
          c.globalAlpha = 1;
        });
        c.restore();
      }
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
    percentLabels,
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
        opacity: hidden ? 0 : seriesDimStyle(hover, seriesId, hoverDim),
        transition: "opacity 250ms ease",
      }}
    >
      {final.slices.map((s, i) => {
        const path = paths[i]?.path ?? s.path;
        const isHovered = i === hoveredIndex;
        const off = isHovered ? s.popOffset : { dx: 0, dy: 0 };
        return (
          <g key={i} transform={`translate(${final.cx} ${final.cy})`}>
            <path
              d={path}
              fill={sliceColors[i] ?? baseColor}
              transform={isHovered ? `translate(${off.dx} ${off.dy})` : undefined}
              style={{ transition: "transform 150ms ease" }}
            />
          </g>
        );
      })}
      {percentLabels.length > 0 &&
        (() => {
          const entrance = prev === null;
          const fracs = entrance
            ? sliceRevealFractions(final, progress)
            : percentLabels.map(() => 1);
          return percentLabels.map((lb) => {
            const lp = Math.max(0.001, fracs[lb.index] ?? 0);
            const size = 11 * lp;
            if (size < 2) return null;
            const text = pctLabel(lb.pct * lp);
            const w = text.length * size * 0.58 + 12 * lp;
            const h = 17 * lp;
            return (
              <g key={lb.index} opacity={lp} pointerEvents="none">
                <rect
                  x={lb.x - w / 2}
                  y={lb.y - h / 2}
                  width={w}
                  height={h}
                  rx={h / 2}
                  fill={shadeColor(lb.color, 0.45)}
                />
                <text
                  x={lb.x}
                  y={lb.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={size}
                  fontWeight={600}
                  fill="#fff"
                >
                  {text}
                </text>
              </g>
            );
          });
        })()}
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
