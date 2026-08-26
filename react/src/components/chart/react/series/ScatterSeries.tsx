/**
 * <Chart.Scatter> — scatter / bubble series.
 *
 * One marker per datum on the shared x/y scales (linear, log or time) with
 * an optional area-proportional radius from a size field. The hovered point
 * grows, brightens and can restyle its fill/border; the other series dim via
 * the root's hoverDim. SVG and canvas renderers share the same geometry.
 */
import { useEffect, useRef } from "react";
import {
  computeScatterGeometry,
  frameScatterGeometry,
} from "../../engine/series/scatter";
import type { ScatterGeometry } from "../../engine/series/scatter";
import { shadeColor, tintColor } from "../../engine/theme";
import type { ContinuousScale, MarkerShape } from "../../engine/types";
import { useChart } from "../ChartContext";
import { findSeries } from "../series-common";
import type { ScatterSeriesProps } from "../props";

/** Marker path for the non-circle shapes (same shapes as line markers). */
function markerPath(
  shape: MarkerShape,
  x: number,
  y: number,
  r: number,
): string {
  switch (shape) {
    case "square":
      return `M${x - r},${y - r}h${r * 2}v${r * 2}h${-r * 2}Z`;
    case "triangle":
      return `M${x},${y - r}L${x + r},${y + r}L${x - r},${y + r}Z`;
    case "diamond":
      return `M${x},${y - r}L${x + r},${y}L${x},${y + r}L${x - r},${y}Z`;
    case "cross":
      return `M${x - r},${y - r}L${x + r},${y + r}M${x + r},${y - r}L${x - r},${y + r}`;
    case "star": {
      const r2 = r * 0.45;
      return [
        `M${x},${y - r}`,
        `L${x + r2},${y - r2}`,
        `L${x + r},${y}`,
        `L${x + r2},${y + r2}`,
        `L${x},${y + r}`,
        `L${x - r2},${y + r2}`,
        `L${x - r},${y}`,
        `L${x - r2},${y - r2}Z`,
      ].join("");
    }
    case "circle":
    default:
      return `M${x - r},${y}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0Z`;
  }
}

export function ScatterSeries(props: ScatterSeriesProps<unknown>) {
  const ctx = useChart();
  const {
    renderer,
    progress,
    dataSig,
    animationsDisabled,
    animType,
    registerDraw,
    unregisterDraw,
    hover,
    hoverDim,
    theme,
    xScale,
    yScale,
    rightYScale,
  } = ctx;
  const me = findSeries(
    ctx,
    "scatter",
    props.id,
    props.data,
    (props as { __chartSeriesToken?: object }).__chartSeriesToken,
  );
  const lastSigRef = useRef<string | null>(null);
  const lastRef = useRef<ScatterGeometry | null>(null);
  const prevRef = useRef<ScatterGeometry | null>(null);

  // ── Final (settled) geometry ──────────────────────────────────────────────
  let final: ScatterGeometry | null = null;
  let seriesId = "scatter-series";
  let hidden = false;
  let seriesColor = "#8b5cf6";
  let markerShape: MarkerShape = "circle";
  let opacity = 1;
  let fillOpacity = 1;
  let borderWidth = 0;
  let borderColor: string | undefined;
  let hoverRadiusMultiplier = 1.3;
  let hoverSize: number | undefined;
  let hoverBrightness = 1.1;
  let hoverBackground: "auto" | string = "auto";
  let hoverBorderWidth = 0;
  let hoverBorderColor: string | undefined;

  const vs: ContinuousScale | null =
    props.yFieldAxis === "right" && rightYScale ? rightYScale : yScale;

  if (me && xScale && vs) {
    const d = me.descriptor;
    hidden = me.hidden;
    seriesId = d.id;
    seriesColor = me.color;
    markerShape = d.markerShape ?? "circle";
    opacity = d.scatterOpacity ?? 1;
    fillOpacity = d.fillOpacity ?? 1;
    borderWidth = d.scatterBorderWidth ?? 0;
    borderColor = d.scatterBorderColor;
    hoverRadiusMultiplier = d.scatterHoverRadiusMultiplier ?? 1.3;
    hoverSize = d.scatterHoverSize;
    hoverBrightness = d.scatterHoverBrightness ?? 1.1;
    hoverBackground = d.scatterHoverBackground ?? "auto";
    hoverBorderWidth = d.scatterHoverBorderWidth ?? 0;
    hoverBorderColor = d.scatterHoverBorderColor;
    final = computeScatterGeometry({
      data: d.data,
      xAccessor: d.xAccessor,
      yAccessor: d.yAccessor ?? (() => null),
      sizeAccessor: d.scatterSizeAccessor,
      xScale,
      yScale: vs,
      minSize: d.scatterMinSize,
      maxSize: d.scatterMaxSize,
    });
  }

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

  // ── Hover resolution ──────────────────────────────────────────────────────
  const hoveredIndex =
    hover && final
      ? hover.items.find((i) => i.seriesId === seriesId)?.index ?? null
      : null;
  const dimmed =
    !hidden &&
    hover !== null &&
    hoverDim < 1 &&
    !hover.items.some((i) => i.seriesId === seriesId);

  const border = borderWidth > 0 ? borderColor ?? shadeColor(seriesColor, -0.35) : undefined;
  const hoverFill =
    hoverBackground === "auto" ? seriesColor : hoverBackground;
  const hoverBorder =
    hoverBorderWidth > 0 ? hoverBorderColor ?? tintColor(hoverFill, 0.5) : undefined;

  /** Radius of the hovered point (explicit size wins over the multiplier). */
  const hoverR = (r: number) => (hoverSize != null ? hoverSize : r * hoverRadiusMultiplier);

  // ── Canvas registration ───────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const isEntrance = prevRef.current === null;
      const p = animationsDisabled ? 1 : st.progress;
      const g = isEntrance
        ? animType === "fade"
          ? final!
          : frameScatterGeometry(null, final!, p)
        : frameScatterGeometry(prevRef.current, final!, p);
      c.save();
      c.globalAlpha =
        (isEntrance && animType === "fade"
          ? Math.max(0.001, p)
          : 1) *
        (dimmed ? hoverDim : 1);
      for (let i = 0; i < g.points.length; i++) {
        const pt = g.points[i];
        const isHovered = hoveredIndex === i;
        const r = isHovered ? hoverR(pt.r) : pt.r;
        const path2D = new Path2D(markerPath(markerShape, pt.x, pt.y, r));
        c.globalAlpha =
          ((isEntrance && animType === "fade"
            ? Math.max(0.001, p)
            : 1) *
            (dimmed ? hoverDim : 1)) *
          (isHovered ? 1 : fillOpacity) *
          opacity;
        c.fillStyle = isHovered ? hoverFill : seriesColor;
        c.fill(path2D);
        if (isHovered && hoverBorder) {
          c.strokeStyle = hoverBorder;
          c.lineWidth = hoverBorderWidth;
          c.stroke(path2D);
        } else if (borderWidth > 0 && border) {
          c.strokeStyle = border;
          c.lineWidth = borderWidth;
          c.stroke(path2D);
        }
      }
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
    seriesColor,
    markerShape,
    opacity,
    fillOpacity,
    borderWidth,
    border,
    hoverSize,
    hoverRadiusMultiplier,
    hoverBrightness,
    hoverBackground,
    hoverBorderWidth,
    hoverBorder,
    hover,
    dimmed,
    hoveredIndex,
    theme,
    animationsDisabled,
    animType,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null) return null;

  // ── SVG render ────────────────────────────────────────────────────────────
  if (renderer !== "svg") return null;
  const p = animationsDisabled ? 1 : progress;
  const g = entrance
    ? animType === "fade"
      ? final
      : frameScatterGeometry(null, final, p)
    : frameScatterGeometry(prev, final, p);
  const groupOpacity =
    (dimmed ? hoverDim : 1) * (entrance && animType === "fade" ? Math.max(0.001, p) : 1);

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: hidden ? 0 : groupOpacity,
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      {g.points.map((pt, i) => {
        const isHovered = hoveredIndex === i;
        const r = isHovered ? hoverR(pt.r) : pt.r;
        const dPath = markerPath(markerShape, pt.x, pt.y, r);
        return (
          <path
            key={`pt-${i}`}
            className="chart-scatter-point"
            d={dPath}
            fill={isHovered ? hoverFill : seriesColor}
            fillOpacity={isHovered ? 1 : fillOpacity * opacity}
            stroke={isHovered && hoverBorder ? hoverBorder : borderWidth > 0 ? border : undefined}
            strokeWidth={isHovered ? hoverBorderWidth : borderWidth > 0 ? borderWidth : undefined}
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
