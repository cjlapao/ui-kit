/**
 * <Chart.Polar> — one ring of annular sectors per series on a shared
 * category set (rose / nightingale chart).
 *
 * SVG: renders each segment path (solid fill, optional border), animated
 * by the root's shared progress (radial growth on entrance, radius
 * interpolation on updates). Canvas: registers a draw function painting
 * the same geometry. Hovered segments pop radially and brighten; the
 * root's hoverDim fades the other series.
 */
import { useEffect, useRef } from "react";
import {
  computePolarGeometry,
  framePolarGeometry,
  roundedAnnularSector,
  type PolarSegment,
} from "../../engine/index";
import type { PolarLayout, PolarGeometry } from "../../engine/types";
import { useChart } from "../ChartContext";
import { findSeries, polarSeriesDimStyle } from "../series-common";
import type { PolarSeriesProps } from "../props";

/** Scale segment radii toward the hole (entrance frames), rebuilding
 * each path so the growth is actually visible. */
function entranceFrame(
  g: PolarGeometry,
  p: number,
  layout: PolarLayout,
  radius = 0,
): PolarGeometry {
  if (p >= 1) return g;
  const segments = g.segments.map((seg) => {
    const r0 = layout.innerR;
    const r1 = layout.innerR + (seg.rOuter - layout.innerR) * p;
    return {
      ...seg,
      rInner: r0,
      rOuter: r1,
      path:
        roundedAnnularSector(
          layout.cx,
          layout.cy,
          r0,
          Math.max(r0 + 0.5, r1),
          seg.a0,
          seg.a1,
          radius,
        ) || seg.path,
    };
  });
  return { ...g, segments };
}

export function PolarSeries(props: PolarSeriesProps<unknown>) {
  const ctx = useChart();
  const {
    renderer,
    progress,
    dataSig,
    animationsDisabled,
    registerDraw,
    unregisterDraw,
    hover,
    hoverDim,
    theme,
    polar,
  } = ctx;
  const me = findSeries(
    ctx,
    "polar",
    props.id,
    props.data,
    (props as { __chartSeriesToken?: object }).__chartSeriesToken,
  );
  const lastSigRef = useRef<string | null>(null);
  const lastRef = useRef<PolarGeometry | null>(null);
  const prevRef = useRef<PolarGeometry | null>(null);

  // ── Final (settled) geometry ──────────────────────────────────────────────
  let final: PolarGeometry | null = null;
  let seriesId = "polar-series";
  let hidden = false;
  let seriesColor = "#8b5cf6";
  let mode: "group" | "stack" = "group";
  let segmentRadius = 0;
  let borderWidth = 0;
  let hoverBrightness = 1.1;
  let hoverOffset = 4;

  if (me && polar) {
    const d = me.descriptor;
    hidden = me.hidden;
    seriesId = d.id;
    seriesColor = me.color;
    mode = d.polarMode ?? "group";
    segmentRadius = d.polarSegmentRadius ?? 0;
    borderWidth = d.polarBorderWidth ?? 0;
    hoverBrightness = d.polarHoverBrightness ?? 1.1;
    hoverOffset = d.polarHoverOffset ?? 4;
    // Compute the FULL multi-series geometry (so stack bands accumulate
    // across series exactly as the root's hover geometry does) and keep
    // only this series' segments.
    if (d.polarAccessor) {
      const allSeries = ctx.series
          .filter((st) => st.descriptor.type === "polar")
          .map((st) => ({
            id: st.descriptor.id,
            values: st.descriptor.data.map((item, i) =>
              st.descriptor.polarAccessor?.(item, i) ?? null,
            ),
          }));
      const full = computePolarGeometry({
        categories: polar.categories,
        series: allSeries,
        mode,
        cx: polar.cx,
        cy: polar.cy,
        R: polar.R,
        innerR: polar.innerR,
        valueMax: polar.valueMax,
        maxTotal: Math.max(...polar.categoryTotals, 0),
        gapAngle: polar.gapAngle,
        bandGap: polar.bandGap,
        segmentRadius,
      });
      final = {
        ...full,
        segments: full.segments.filter((sg) => sg.seriesId === d.id),
      };
    }
  }

  // Bookkeeping on settled renders only — guarded by the root's data
  // signature (stable across StrictMode's double render) so the previous
  // settled geometry is captured exactly once per data change.
  // Bookkeeping on settled renders only — guarded by the root's data
  // signature (stable across StrictMode's double render) so the previous
  // settled geometry is captured exactly once per data change.
  if (progress >= 1 && final !== null && lastSigRef.current !== dataSig) {
    prevRef.current = lastRef.current;
    lastRef.current = final;
    lastSigRef.current = dataSig;
  }
  const prev = progress < 1 ? prevRef.current : null;
  const entrance = prev === null;

  /** Hover pop: shift a segment's radii outward and rebuild its path. */
  const popSegment = (seg: PolarSegment, offset: number): PolarSegment => {
    const r0 = seg.rInner + offset;
    const r1 = seg.rOuter + offset;
    return {
      ...seg,
      rInner: r0,
      rOuter: r1,
      path: rebuiltPath(seg, r0, r1),
    };
  };

  function rebuiltPath(
    seg: PolarSegment,
    r0: number,
    r1: number,
  ): string {
    // Reuse the engine's sector builder with the shifted radii.
    return roundedAnnularSector(
      polar!.cx,
      polar!.cy,
      r0,
      Math.max(r0 + 0.5, r1),
      seg.a0,
      seg.a1,
      segmentRadius,
    ) || seg.path;
  }

  /** Whether this series' category is the hovered one (for the pop). */
  const hoveredCategory =
    hover && polar ? hoveredSegment(final) : null;

  function hoveredSegment(g: PolarGeometry | null): PolarSegment | null {
    if (!g || !hover || !polar) return null;
    const hit = hover.items.find((i) => i.seriesId === seriesId);
    if (!hit) return null;
    // The hover index is the hovered row's DATA index; segments carry the
    // display slot index — map through the layout's categoryOrder.
    const seg = g.segments.find(
      (s) =>
        s.seriesId === seriesId &&
        polar!.categoryOrder[s.categoryIndex] === hit.index,
    );
    return seg ?? null;
  }

  // ── Canvas registration ───────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden || !polar) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const isEntrance = prevRef.current === null;
      const p = animationsDisabled ? 1 : st.progress;
      let g: PolarGeometry;
      if (isEntrance) {
        g = entranceFrame(final!, p, polar, segmentRadius);
      } else {
        g = framePolarGeometry(
          final!,
          prevRef.current,
          p,
          {
            cx: polar.cx,
            cy: polar.cy,
            segmentRadius,
            sharedTotals: polar.categoryTotals,
            bandGap: polar.bandGap,
            R: polar.R,
            innerR: polar.innerR,
          },
        );
      }
      c.save();
      c.globalAlpha = isEntrance ? Math.max(0.001, p) : 1;
      const hoveredCat = hover
        ? g.segments.find(
            (s) =>
              s.seriesId === seriesId &&
              hover.items.some(
                (i) =>
                  i.seriesId === seriesId &&
                  i.index === polar.categoryOrder[s.categoryIndex],
              ),
          )
        : undefined;
      for (const seg of g.segments) {
        const isHovered =
          hoveredCat !== undefined &&
          seg.categoryIndex === hoveredCat.categoryIndex;
        const s2 = isHovered ? popSegment(seg, hoverOffset) : seg;
        const path2D = new Path2D(s2.path);
        c.fillStyle = seriesColor;
        c.fill(path2D);
        if (borderWidth > 0) {
          c.strokeStyle = seriesColor;
          c.lineWidth = borderWidth;
          c.stroke(path2D);
        }
        if (isHovered && hoverBrightness > 1) {
          // Lighten pass: an inner highlight stroke approximates brightness.
          c.strokeStyle = "rgba(255,255,255,0.35)";
          c.lineWidth = 1.5;
          c.stroke(path2D);
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
    polar,
    seriesId,
    seriesColor,
    mode,
    segmentRadius,
    borderWidth,
    hoverBrightness,
    hoverOffset,
    hover,
    theme,
    animationsDisabled,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null) return null;

  // ── SVG render (temp log moved below g computation)

  // ── SVG render ────────────────────────────────────────────────────────────
  if (renderer !== "svg") return null;
  const p = animationsDisabled ? 1 : progress;
  const g = entrance
    ? entranceFrame(final, p, polar!, segmentRadius)
    : framePolarGeometry(final, prev, p, {
        cx: polar!.cx,
        cy: polar!.cy,
        segmentRadius,
        sharedTotals: polar!.categoryTotals,
        bandGap: polar!.bandGap,
        R: polar!.R,
        innerR: polar!.innerR,
      });
  const hovered = hoveredCategory;
  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: hidden ? 0 : polarSeriesDimStyle(hover, seriesId, hoverDim),
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      {g.segments.map((seg, i) => {
        const isHovered =
          hovered !== null && seg.categoryIndex === hovered.categoryIndex && seg.seriesId === seriesId;
        const s2 = isHovered ? popSegment(seg, hoverOffset) : seg;
        return (
          <path
            key={`seg-${seg.categoryIndex}-${i}`}
            d={s2.path}
            fill={seriesColor}
            stroke={borderWidth > 0 ? seriesColor : undefined}
            strokeWidth={borderWidth > 0 ? borderWidth : undefined}
            style={
              isHovered && hoverBrightness > 1
                ? { filter: `brightness(${hoverBrightness})` }
                : undefined
            }
          />
        );
      })}
    </g>
  );
}

