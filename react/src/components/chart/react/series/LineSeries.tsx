/**
 * <Chart.Line> — line/area series.
 *
 * SVG: renders paths + markers, animated by the root's shared progress
 * (clip reveal on entrance, point interpolation on updates).
 * Canvas: registers a draw function painting the same geometry.
 */
import { useEffect, useId, useRef } from "react";
import {
  areaPathFromPoints,
  computeLineGeometry,
  decimate,
  interpolateArrays,
  linePathFromPoints,
} from "../../engine/index";
import type {
  GradientColor,
  LineCurve,
  LineGeometry,
  MarkerShape,
} from "../../engine/types";
import { useChart } from "../ChartContext";
import { findSeries, valueScaleFor } from "../series-common";
import type { LineSeriesProps } from "../props";

/** Interpolate a line geometry toward its previous one (update frames). */
function frameGeometry(
  cur: LineGeometry,
  prev: LineGeometry | null,
  p: number,
  curve: LineCurve,
  baselineY: number,
): LineGeometry {
  if (!prev || p >= 1) return cur;
  if (cur.points.length === 0) return cur;
  const xs = interpolateArrays(
    prev.points.map((pt) => pt.x),
    cur.points.map((pt) => pt.x),
    p,
  );
  const ys = interpolateArrays(
    prev.points.map((pt) => pt.y),
    cur.points.map((pt) => pt.y),
    p,
  );
  const points = cur.points.map((pt, i) => ({
    ...pt,
    x: xs[i] ?? pt.x,
    y: ys[i] ?? pt.y,
  }));
  return {
    ...cur,
    points,
    linePath: linePathFromPoints(points, curve),
    areaPath: areaPathFromPoints(points, baselineY, curve),
    first: points[0] ?? null,
    last: points[points.length - 1] ?? null,
  };
}

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

export function LineSeries(props: LineSeriesProps<unknown>) {
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
  } = ctx;
  const me = findSeries(ctx, "line", props.id, props.data);
  const clipId = useId().replace(/:/g, "");
  const gradId = useId().replace(/:/g, "");
  const lastRef = useRef<LineGeometry | null>(null);
  const prevRef = useRef<LineGeometry | null>(null);

  // ── Final (settled) geometry — recomputed fresh each render (cheap) ──────
  let final: LineGeometry | null = null;
  let curve: LineCurve = "linear";
  let fillOpacity = 0;
  let colorObj: GradientColor | null = null;
  let seriesId = "line";
  let hidden = false;
  let lineStrokeWidth = 2;
  let lineDash: number[] | null | undefined;
  let showMarkers = false;
  let markerSize = 3.5;
  let markerShape: MarkerShape = "circle";
  let seriesColor = "#8b5cf6";

  if (me && xScale) {
    const d = me.descriptor;
    hidden = me.hidden;
    curve = d.curve ?? "linear";
    fillOpacity = d.fillOpacity ?? 0;
    seriesId = d.id;
    lineStrokeWidth = d.lineStrokeWidth ?? 2;
    lineDash = d.lineDash ?? null;
    showMarkers = d.showMarkers ?? false;
    markerSize = d.markerSize ?? 3.5;
    markerShape = d.markerShape ?? "circle";
    seriesColor = me.color;
    if (typeof d.color === "object" && d.color !== null && "stops" in (d.color as object)) {
      colorObj = d.color as GradientColor;
    }
    const vs = valueScaleFor(ctx, d);
    if (vs) {
      let points = d.data.map((item, i) => {
        const rawX = d.xAccessor(item, i);
        const rawY = d.yAccessor ? d.yAccessor(item, i) : null;
        const x = xScale.map(rawX as never);
        const missing = rawY == null || !Number.isFinite(rawY as number);
        return {
          x,
          y: missing ? null : vs.map(rawY as number),
          value: missing ? null : (rawY as number),
          item,
          index: i,
        };
      });
      if (d.maxDataPoints && points.length > d.maxDataPoints) {
        points = decimate(points, d.maxDataPoints);
      }
      final = computeLineGeometry({
        points,
        curve,
        connectNulls: d.connectNulls ?? "gap",
        baselineY: area.y + area.height,
        zeroY: vs.map(0),
      });
    }
  }

  // Previous settled geometry (update-animation source).
  if (lastRef.current !== final) {
    prevRef.current = lastRef.current;
    lastRef.current = final;
  }
  const prev = prevRef.current;
  const entrance = prev === null;
  const baselineY = area.y + area.height;

  // ── Canvas registration ───────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const g = frameGeometry(final!, prevRef.current, st.progress, curve, baselineY);
      const p = prevRef.current === null ? st.progress : 1;
      c.save();
      if (prevRef.current === null) {
        c.beginPath();
        c.rect(area.x, 0, area.width * Math.max(0.001, st.progress), height);
        c.clip();
      }
      if (fillOpacity > 0 && g.areaPath) {
        c.globalAlpha = fillOpacity * p;
        c.fillStyle =
          colorObj !== null ? canvasGradient(c, area, colorObj) : seriesColor;
        c.fill(new Path2D(g.areaPath));
        c.globalAlpha = 1;
      }
      c.strokeStyle = seriesColor;
      c.lineWidth = lineStrokeWidth;
      c.lineJoin = "round";
      c.lineCap = "round";
      if (lineDash) c.setLineDash(lineDash);
      if (g.linePath) c.stroke(new Path2D(g.linePath));
      c.setLineDash([]);
      if (showMarkers && g.points.length > 0) {
        c.globalAlpha = prevRef.current === null ? st.progress : 1;
        c.fillStyle = seriesColor;
        c.strokeStyle = seriesColor;
        c.lineWidth = 1.5;
        for (const pt of g.points) {
          if (markerShape === "cross") {
            c.beginPath();
            c.moveTo(pt.x - markerSize, pt.y - markerSize);
            c.lineTo(pt.x + markerSize, pt.y + markerSize);
            c.moveTo(pt.x + markerSize, pt.y - markerSize);
            c.lineTo(pt.x - markerSize, pt.y + markerSize);
            c.stroke();
          } else if (markerShape === "circle") {
            c.beginPath();
            c.arc(pt.x, pt.y, markerSize, 0, Math.PI * 2);
            c.fill();
          } else {
            c.fill(new Path2D(markerPath(markerShape, pt.x, pt.y, markerSize)));
          }
        }
        c.globalAlpha = 1;
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
    fillOpacity,
    colorObj,
    seriesColor,
    lineStrokeWidth,
    lineDash,
    showMarkers,
    markerSize,
    markerShape,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null) return null;

  // ── SVG render ────────────────────────────────────────────────────────────
  if (renderer !== "svg") return null;
  const g = frameGeometry(final, prev, progress, curve, baselineY);
  const entranceP = entrance ? (animationsDisabled ? 1 : progress) : 1;
  const fill = colorObj !== null ? `url(#${gradId})` : seriesColor;

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
        {colorObj !== null && (
          <linearGradient
            id={gradId}
            x1={area.x + colorObj.x1 * area.width}
            y1={area.y + colorObj.y1 * area.height}
            x2={area.x + colorObj.x2 * area.width}
            y2={area.y + colorObj.y2 * area.height}
            gradientUnits="userSpaceOnUse"
          >
            {colorObj.stops.map((s, i) => (
              <stop
                key={i}
                offset={s.offset}
                stopColor={s.color}
                stopOpacity={s.opacity ?? 1}
              />
            ))}
          </linearGradient>
        )}
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {fillOpacity > 0 && g.areaPath && (
          <path d={g.areaPath} fill={fill} opacity={fillOpacity * entranceP} />
        )}
        {g.linePath && (
          <path
            d={g.linePath}
            fill="none"
            stroke={seriesColor}
            strokeWidth={lineStrokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={lineDash ? lineDash.join(" ") : undefined}
          />
        )}
        {showMarkers &&
          g.points.map((pt) => (
            <path
              key={pt.index}
              d={markerPath(markerShape, pt.x, pt.y, markerSize)}
              fill={markerShape === "cross" ? "none" : seriesColor}
              stroke={markerShape === "cross" ? seriesColor : undefined}
              strokeWidth={markerShape === "cross" ? 1.5 : undefined}
              opacity={entrance ? entranceP : 1}
            />
          ))}
      </g>
    </g>
  );
}

/** Canvas gradient fill matching the SVG userSpaceOnUse setup. */
function canvasGradient(
  c: CanvasRenderingContext2D,
  area: { x: number; y: number; width: number; height: number },
  color: GradientColor,
): CanvasGradient {
  const g = c.createLinearGradient(
    area.x + color.x1 * area.width,
    area.y + color.y1 * area.height,
    area.x + color.x2 * area.width,
    area.y + color.y2 * area.height,
  );
  for (const s of color.stops) {
    g.addColorStop(s.offset, s.color);
  }
  return g;
}
