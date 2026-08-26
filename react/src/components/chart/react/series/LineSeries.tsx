/**
 * <Chart.Line> — line/area series.
 *
 * SVG: renders paths + markers, animated by the root's shared progress
 * (clip reveal on entrance, point interpolation on updates).
 * Canvas: registers a draw function painting the same geometry.
 */
import { useEffect, useId, useRef } from "react";
import {
  bandAreaPath,
  computeLineGeometry,
  decimate,
  interpolateArrays,
  linePathFromPoints,
} from "../../engine/index";
import type {
  ChartAreaFill,
  GradientColor,
  LineCurve,
  LineGeometry,
  MarkerShape,
} from "../../engine/types";
import { useChart } from "../ChartContext";
import {
  findSeries,
  valueScaleFor,
  seriesDimStyle
} from "../series-common";
import type { LineSeriesProps } from "../props";
import {
  AreaFillGradientDef,
  canvasAreaFill,
  resolveAreaFill,
} from "./AreaFill";

interface FrameBaseline {
  x: number;
  y: number;
}

/**
 * Interpolate a line geometry toward its previous one (update frames).
 * `baselinePoints` (final pixel baseline) re-closes the area when the fill
 * follows a second field; it is interpolated against `prevBaseline` the
 * same way the main curve is.
 */
function frameGeometry(
  cur: LineGeometry,
  prev: LineGeometry | null,
  p: number,
  curve: LineCurve,
  baselineY: number,
  baselinePoints?: FrameBaseline[] | null,
  prevBaseline?: FrameBaseline[] | null,
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
  let areaPath = cur.areaPath;
  if (baselinePoints) {
    const frameBase: FrameBaseline[] = points.map((pt, i) => {
      const b = baselinePoints[i] ?? null;
      const pb = prevBaseline?.[pt.index] ?? null;
      if (!b) return { x: pt.x, y: baselineY };
      if (!pb) return { x: pt.x, y: b.y };
      return { x: pb.x + (b.x - pb.x) * p, y: pb.y + (b.y - pb.y) * p };
    });
    areaPath = bandAreaPath(
      points.map((pt, i) => ({ x: pt.x, y0: frameBase[i].y, y1: pt.y })),
      curve,
    );
  }
  return {
    ...cur,
    points,
    linePath: linePathFromPoints(points, curve),
    areaPath,
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

export function LineSeries(props: LineSeriesProps<unknown>) {
  const ctx = useChart();
  const {
    renderer,
    xScale,
    area,
    height,
    progress,
    dataSig,
    animationsDisabled,
    registerDraw,
    unregisterDraw,
    hover,
    theme,hoverDim,
    animType,} = ctx;
  const me = findSeries(ctx, "line", props.id, props.data, (props as { __chartSeriesToken?: object }).__chartSeriesToken);
  const clipId = useId().replace(/:/g, "");
  const gradId = useId().replace(/:/g, "");
  const lastSigRef = useRef<string | null>(null);
  const lastRef = useRef<LineGeometry | null>(null);
  const prevRef = useRef<LineGeometry | null>(null);
  const lastBaseRef = useRef<{ x: number; y: number }[] | null>(null);
  const prevBaseRef = useRef<{ x: number; y: number }[] | null>(null);

  // ── Final (settled) geometry — recomputed fresh each render (cheap) ──────
  let final: LineGeometry | null = null;
  let finalBaseline: { x: number; y: number }[] | null = null;
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
  let fillSpec: ChartAreaFill | null = null;

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
        // Band categories center the vertex on the category slot (bars,
        // scatter markers, and tick labels all sit on the slot center).
        const x = "bandWidth" in xScale ? xScale.center(String(rawX)) : xScale.map(rawX as never);
        const missing = rawY == null || !Number.isFinite(rawY as number);
        return {
          x,
          y: missing ? null : vs.map(rawY as number),
          value: missing ? null : (rawY as number),
          item,
          index: i,
        };
      });
      let baselinePoints: { x: number; y: number | null }[] | undefined;
      if (d.fillBaseline === "field" && d.fillBaselineAccessor) {
        baselinePoints = d.data.map((item, i) => {
          const rawX = d.xAccessor(item, i);
          const rawB = d.fillBaselineAccessor!(item, i);
          const missing =
            rawB == null || !Number.isFinite(rawB as number);
          return {
            x: "bandWidth" in xScale ? xScale.center(String(rawX)) : xScale.map(rawX as never),
            y: missing ? null : vs.map(rawB as number),
          };
        });
        if (d.maxDataPoints && baselinePoints.length > d.maxDataPoints) {
          baselinePoints = decimate(baselinePoints, d.maxDataPoints);
        }
      }
      if (d.maxDataPoints && points.length > d.maxDataPoints) {
        points = decimate(points, d.maxDataPoints);
      }
      final = computeLineGeometry({
        points,
        curve,
        connectNulls: d.connectNulls ?? "gap",
        baselineY: area.y + area.height,
        zeroY: vs.map(0),
        baselinePoints,
      });
      if (fillOpacity > 0) {
        fillSpec = resolveAreaFill(
          {
            fillStyle: d.fillStyle,
            fillColor: d.fillColor,
            fillOpacity: d.fillOpacity,
            fillDirection: d.fillDirection,
          },
          seriesColor,
        );
        finalBaseline = baselinePoints
          ? baselinePoints
              .filter((b) => b.y !== null)
              .map((b) => ({ x: b.x, y: b.y as number }))
          : null;
      }
    }
  }

  // Previous settled geometry (update-animation source). Bookkeeping only
  // happens on settled renders: while the animation runs, `prev` must stay
  // the previous settled geometry (null during the entrance) — otherwise the
  // first frame would switch to update interpolation and the entrance never
  // becomes visible.
  if (progress >= 1 && final !== null && lastSigRef.current !== dataSig) {
    prevRef.current = lastRef.current;
    prevBaseRef.current = lastBaseRef.current;
    lastRef.current = final;
    lastBaseRef.current = finalBaseline;
    lastSigRef.current = dataSig;
  }
  const prev = progress < 1 ? prevRef.current : null;
  const prevBase = progress < 1 ? prevBaseRef.current : null;
  const entrance = prev === null;
  const baselineY = area.y + area.height;

  // ── Canvas registration ───────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden) return;
    const id = `series:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const g = frameGeometry(
        final!,
        prevRef.current,
        st.progress,
        curve,
        baselineY,
        lastBaseRef.current,
        prevBaseRef.current,
      );
      const p = prevRef.current === null ? st.progress : 1;
      c.save();
      if (prevRef.current === null) {
        if (animType !== "fade") {
          c.beginPath();
          c.rect(area.x, 0, area.width * Math.max(0.001, st.progress), height);
          c.clip();
        }
        if (animType === "fade") {
          c.globalAlpha = Math.max(0.001, st.progress);
        }
      }
      if (fillSpec && fillSpec.opacity > 0 && g.areaPath) {
        const fillBase =
          colorObj !== null
            ? colorObj.stops[0]?.color ?? seriesColor
            : seriesColor;
        c.globalAlpha = (fillSpec.style === "flat" ? fillSpec.opacity : 1) * p;
        if (fillSpec.color) {
          c.fillStyle = canvasAreaFill(c, fillSpec, { area });
        } else if (fillSpec.style === "flat" && colorObj !== null) {
          // A gradient series color still paints the flat fill as a
          // gradient (legacy behavior).
          c.fillStyle = canvasGradient(c, area, colorObj);
        } else if (fillSpec.style === "flat") {
          c.fillStyle = fillBase;
        } else {
          c.fillStyle = canvasAreaFill(c, { ...fillSpec, color: fillBase }, {
            area,
          });
        }
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
      // Hover highlight: enlarged marker at the hovered point (reference
      // behavior — every series pops its marker on the crosshair).
      const hoverItem = hover?.items.find((it) => it.seriesId === seriesId);
      if (hover && hoverItem && !hidden) {
        c.beginPath();
        c.arc(hover.x, hoverItem.y, markerSize + 2.5, 0, Math.PI * 2);
        c.fillStyle = seriesColor;
        c.fill();
        c.lineWidth = 1.5;
        c.strokeStyle = theme.crosshairColor;
        c.stroke();
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
    fillSpec,
    colorObj,
    seriesColor,
    lineStrokeWidth,
    lineDash,
    showMarkers,
    markerSize,
    markerShape,
    hover,
    theme,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null) return null;

  // ── SVG render ────────────────────────────────────────────────────────────
  if (renderer !== "svg") return null;
  const g = frameGeometry(
    final,
    prev,
    progress,
    curve,
    baselineY,
    finalBaseline,
    prevBase,
  );
  const entranceP = entrance ? (animationsDisabled ? 1 : progress) : 1;
  const fill = colorObj !== null ? `url(#${gradId})` : seriesColor;
  const areaBase =
    colorObj !== null
      ? colorObj.stops[0]?.color ?? seriesColor
      : seriesColor;
  const hoverItem = hover?.items.find((it) => it.seriesId === seriesId);
  const hoverDot = hover && hoverItem && !hidden ? hoverItem : null;

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
      <defs>
        <clipPath id={clipId}>
          <rect
            x={area.x}
            y={0}
            width={
              area.width *
              (entrance && animType !== "fade" ? entranceP : 1)
            }
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
        {fillSpec && fillSpec.style === "gradient" && (
          <AreaFillGradientDef
            id={gradId + "area"}
            spec={{
              ...fillSpec,
              color: fillSpec.color ?? areaBase,
            }}
            ctx={{ area }}
          />
        )}
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {fillSpec && fillSpec.opacity > 0 && g.areaPath && (
          <path
            d={g.areaPath}
            fill={
              fillSpec.style === "gradient"
                ? `url(#${gradId}area)`
                : fillSpec.color ?? fill
            }
            opacity={
              (fillSpec.style === "flat" ? fillSpec.opacity : 1) *
                (entrance && animType === "fade" ? 1 : entranceP)
            }
          />
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
              opacity={
                entrance ? (animType === "fade" ? 1 : entranceP) : 1
              }
            />
          ))}
      </g>
      {hoverDot && (
        <circle
          cx={hover!.x}
          cy={hoverDot.y}
          r={markerSize + 2.5}
          fill={seriesColor}
          stroke={theme.crosshairColor}
          strokeWidth={1.5}
          pointerEvents="none"
        />
      )}
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

