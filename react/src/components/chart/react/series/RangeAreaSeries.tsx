/**
 * <Chart.RangeArea> — a band between a lower (min) and an upper (max)
 * edge, both smoothed independently.
 *
 * SVG: renders the closed band + (optional) edge strokes, animated by the
 * root's shared progress (clip reveal on entrance, point interpolation on
 * updates). Canvas: registers a draw function painting the same geometry.
 * Fills use the shared ChartAreaFill spec (flat or gradient).
 */
import { useEffect, useId, useRef } from "react";
import {
  computeRangeAreaGeometry,
  decimate,
  frameRangeAreaGeometry,
  type RangeAreaPlottedPoint,
} from "../../engine/index";
import type {
  ChartAreaFill,
  GradientColor,
  LineCurve,
  RangeAreaGeometry,
} from "../../engine/types";
import { useChart } from "../ChartContext";
import { findSeries, valueScaleFor } from "../series-common";
import type { RangeAreaSeriesProps } from "../props";
import { AreaFillGradientDef, canvasAreaFill } from "./AreaFill";

/** Interpolate edges toward the axis baseline (entrance frames). */
function entranceFrame(
  g: RangeAreaGeometry,
  p: number,
  baselineY: number,
  curve: LineCurve,
): RangeAreaGeometry {
  if (p >= 1) return g;
  const pts: RangeAreaPlottedPoint[] = g.points.map((pt) => ({
    x: pt.x,
    yMin: baselineY + (pt.yMin - baselineY) * p,
    yMax: baselineY + (pt.yMax - baselineY) * p,
    min: pt.min,
    max: pt.max,
    item: pt.item,
    index: pt.index,
  }));
  return computeRangeAreaGeometry({ points: pts, curve });
}

export function RangeAreaSeries(props: RangeAreaSeriesProps<unknown>) {
  const ctx = useChart();
  const {
    renderer,
    xScale,
    area,
    height,
    progress,
    animationsDisabled,
    registerDraw,
    unregisterDraw,
    hover,
    theme,
  } = ctx;
  const me = findSeries(
    ctx,
    "rangeArea",
    props.id,
    props.data,
    (props as { __chartSeriesToken?: object }).__chartSeriesToken,
  );
  const clipId = useId().replace(/:/g, "");
  const fillGradId = useId().replace(/:/g, "");
  const lastRef = useRef<RangeAreaGeometry | null>(null);
  const prevRef = useRef<RangeAreaGeometry | null>(null);

  // ── Final (settled) geometry — recomputed fresh each render (cheap) ──────
  let final: RangeAreaGeometry | null = null;
  let curve: LineCurve = "linear";
  let seriesId = "range-area";
  let hidden = false;
  let seriesColor = "#8b5cf6";
  let showEdges = true;
  let edgeStrokeWidth = 2;
  let fillSpec: ChartAreaFill | null = null;
  let fillOpacity = 0;
  let colorObj: GradientColor | null = null;

  if (me && xScale) {
    const d = me.descriptor;
    hidden = me.hidden;
    curve = d.curve ?? "linear";
    seriesId = d.id;
    seriesColor = me.color;
    showEdges = d.rangeShowEdges ?? true;
    edgeStrokeWidth = d.rangeEdgeStrokeWidth ?? 2;
    fillOpacity = d.fillOpacity ?? 0;
    if (typeof d.color === "object" && d.color !== null && "stops" in (d.color as object)) {
      colorObj = d.color as GradientColor;
    }
    const vs = valueScaleFor(ctx, d);
    if (
      vs &&
      d.rangeMinAccessor &&
      d.rangeMaxAccessor
    ) {
      let points: RangeAreaPlottedPoint[] = d.data.map((item, i) => {
        const rawX = d.xAccessor(item, i);
        const rawMin = d.rangeMinAccessor!(item, i);
        const rawMax = d.rangeMaxAccessor!(item, i);
        const x = xScale.map(rawX as never);
        const missingMin =
          rawMin == null || !Number.isFinite(rawMin as number);
        const missingMax =
          rawMax == null || !Number.isFinite(rawMax as number);
        return {
          x,
          yMin: missingMin ? null : vs.map(rawMin as number),
          yMax: missingMax ? null : vs.map(rawMax as number),
          min: missingMin ? null : (rawMin as number),
          max: missingMax ? null : (rawMax as number),
          item,
          index: i,
        };
      });
      if (d.maxDataPoints && points.length > d.maxDataPoints) {
        points = decimate(points, d.maxDataPoints);
      }
      final = computeRangeAreaGeometry({
        points,
        curve,
        connectNulls: d.connectNulls ?? "gap",
      });
      if (fillOpacity > 0) {
        const base =
          colorObj !== null
            ? colorObj.stops[0]?.color ?? seriesColor
            : seriesColor;
        fillSpec = {
          style: d.fillStyle ?? "gradient",
          color: d.fillColor ?? base,
          opacity: fillOpacity,
          direction: d.fillDirection ?? "vertical",
        };
      }
    }
  }

  const valueScale = me ? valueScaleFor(ctx, me.descriptor) : null;

  // Previous settled geometry (update-animation source). Bookkeeping only
  // happens on settled renders (same contract as LineSeries).
  if (progress >= 1 && lastRef.current !== final) {
    prevRef.current = lastRef.current;
    lastRef.current = final;
  }
  const prev = progress < 1 ? prevRef.current : null;
  const entrance = prev === null;
  const baselineY = area.y + area.height;

  // ── Canvas registration ───────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const isEntrance = prevRef.current === null;
      let g: RangeAreaGeometry;
      if (isEntrance) {
        g = entranceFrame(
          final!,
          animationsDisabled ? 1 : st.progress,
          baselineY,
          curve,
        );
      } else {
        g = frameRangeAreaGeometry(
          final!,
          prevRef.current,
          st.progress,
          curve,
        );
      }
      c.save();
      if (isEntrance) {
        c.beginPath();
        c.rect(
          area.x,
          0,
          area.width * Math.max(0.001, st.progress),
          height,
        );
        c.clip();
      }
      if (fillSpec && fillSpec.opacity > 0 && g.bandPath) {
        const entranceAlpha = isEntrance ? st.progress : 1;
        c.globalAlpha =
          fillSpec.style === "flat" ? fillSpec.opacity * entranceAlpha : entranceAlpha;
        c.fillStyle = canvasAreaFill(c, fillSpec, { area });
        c.fill(new Path2D(g.bandPath));
        c.globalAlpha = 1;
      }
      if (showEdges && edgeStrokeWidth > 0) {
        c.strokeStyle = seriesColor;
        c.lineWidth = edgeStrokeWidth;
        c.lineJoin = "round";
        c.lineCap = "round";
        if (g.upperPath) c.stroke(new Path2D(g.upperPath));
        if (g.lowerPath) c.stroke(new Path2D(g.lowerPath));
      }
      // Hover: pop dots on both band edges at the hovered x.
      const hoverItem = hover?.items.find((it) => it.seriesId === seriesId);
      const vs = valueScale;
      if (hover && hoverItem && !hidden && vs) {
        const yLo = vs.map(hoverItem.value);
        const yHi =
          hoverItem.valueMax !== undefined ? vs.map(hoverItem.valueMax) : null;
        c.fillStyle = seriesColor;
        c.lineWidth = 1.5;
        c.strokeStyle = theme.crosshairColor;
        c.beginPath();
        c.arc(hover.x, yLo, 3.5, 0, Math.PI * 2);
        c.fill();
        c.stroke();
        if (yHi !== null) {
          c.beginPath();
          c.arc(hover.x, yHi, 3.5, 0, Math.PI * 2);
          c.fill();
          c.stroke();
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
    curve,
    baselineY,
    area,
    height,
    fillSpec,
    fillOpacity,
    showEdges,
    edgeStrokeWidth,
    seriesColor,
    hover,
    theme,
    me,
    ctx,
    animationsDisabled,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null) return null;

  // ── SVG render ────────────────────────────────────────────────────────────
  if (renderer !== "svg") return null;
  const g = entrance
    ? entranceFrame(
        final,
        animationsDisabled ? 1 : progress,
        baselineY,
        curve,
      )
    : frameRangeAreaGeometry(final, prev, progress, curve);
  const entranceP = entrance ? (animationsDisabled ? 1 : progress) : 1;
  const spec =
    fillSpec && fillSpec.opacity > 0 ? fillSpec : null;
  const hoverItem = hover?.items.find((it) => it.seriesId === seriesId);
  const vs = valueScale;
  const hoverDots =
    hover && hoverItem && !hidden && vs
      ? {
          yLo: vs.map(hoverItem.value),
          yHi:
            hoverItem.valueMax !== undefined
              ? vs.map(hoverItem.valueMax)
              : null,
        }
      : null;

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: hidden ? 0 : 1,
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            x={area.x}
            y={0}
            width={area.width * (entrance ? entranceP : 1)}
            height={height}
          />
        </clipPath>
        {spec && spec.style === "gradient" && (
          <AreaFillGradientDef
            id={fillGradId}
            spec={spec}
            ctx={{ area }}
          />
        )}
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {spec && g.bandPath && (
          <path
            d={g.bandPath}
            fill={spec.style === "gradient" ? `url(#${fillGradId})` : spec.color}
            opacity={
              spec.style === "flat" ? spec.opacity * entranceP : entranceP
            }
          />
        )}
        {showEdges &&
          g.upperPath && (
            <path
              d={g.upperPath}
              fill="none"
              stroke={seriesColor}
              strokeWidth={edgeStrokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        {showEdges &&
          g.lowerPath && (
            <path
              d={g.lowerPath}
              fill="none"
              stroke={seriesColor}
              strokeWidth={edgeStrokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
      </g>
      {hoverDots && (
        <g pointerEvents="none">
          <circle
            cx={hover!.x}
            cy={hoverDots.yLo}
            r={3.5}
            fill={seriesColor}
            stroke={theme.crosshairColor}
            strokeWidth={1.5}
          />
          {hoverDots.yHi !== null && (
            <circle
              cx={hover!.x}
              cy={hoverDots.yHi}
              r={3.5}
              fill={seriesColor}
              stroke={theme.crosshairColor}
              strokeWidth={1.5}
            />
          )}
        </g>
      )}
    </g>
  );
}
