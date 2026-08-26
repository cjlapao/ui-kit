/**
 * <Chart.Radar> — one polygon per series on a shared polar grid.
 *
 * SVG: renders the filled polygon, the dashed/solid outline, vertex
 * markers and the (optional) goal marker. Canvas: registers a draw
 * function painting the same geometry. Entrance scales the polygon out
 * from the center; updates interpolate between the previous and current
 * geometry.
 */
import { useEffect, useId, useRef } from "react";
import {
  computeRadarGeometry,
  frameRadarGeometry,
  radarAngle,
  radarPath,
} from "../../engine/index";
import type { RadarGeometry } from "../../engine/types";
import { useChart } from "../ChartContext";
import {
  findSeries,
  seriesDimStyle
} from "../series-common";
import type { RadarSeriesProps } from "../props";
import { hexWithAlpha } from "./AreaFill";

/** Scale a geometry out from the radar center (entrance frames). */
function entranceFrame(
  g: RadarGeometry,
  p: number,
  cx: number,
  cy: number,
  axisCount: number,
): RadarGeometry {
  if (p >= 1) return g;
  const pts = g.points.map((pt) => ({
    ...pt,
    x: cx + (pt.x - cx) * p,
    y: cy + (pt.y - cy) * p,
  }));
  const d = radarPath(pts, axisCount);
  return { ...g, points: pts, linePath: d, fillPath: d };
}

export function RadarSeries(props: RadarSeriesProps<unknown>) {
  const ctx = useChart();
  const {
    renderer,
    progress,
    dataSig,
    animationsDisabled,
    registerDraw,
    unregisterDraw,
    hover,
    theme,
    radar,hoverDim,
  } = ctx;
  const me = findSeries(
    ctx,
    "radar",
    props.id,
    props.data,
    (props as { __chartSeriesToken?: object }).__chartSeriesToken,
  );
  const gradId = useId().replace(/:/g, "");
  const lastRef = useRef<RadarGeometry | null>(null);
  const prevRef = useRef<RadarGeometry | null>(null);
  const lastSigRef = useRef<string | null>(null);

  // ── Final (settled) geometry ──────────────────────────────────────────────
  let final: RadarGeometry | null = null;
  let seriesId = "radar-series";
  let hidden = false;
  let seriesColor = "#8b5cf6";
  let lineDash: number[] | null = null;
  let lineWidth = 2;
  let showMarkers = true;
  let markerSize = 3;
  let goal: number | null = null;
  let goalLabel: string | null = null;
  let fillOpacity = 0;
  let fillStyle: "flat" | "gradient" = "flat";
  let fillColor = "";
  let axisCount = 0;

  if (me && radar) {
    const d = me.descriptor;
    hidden = me.hidden;
    seriesId = d.id;
    seriesColor = me.color;
    axisCount = radar.axisCount;
    lineDash = d.lineDash ?? null;
    lineWidth = d.lineStrokeWidth ?? 2;
    showMarkers = d.radarShowMarkers ?? true;
    markerSize = d.markerSize ?? 3;
    goal = d.radarGoal ?? null;
    goalLabel = d.radarGoalLabel ?? null;
    fillOpacity = d.fillOpacity ?? 0.18;
    fillStyle = d.fillStyle ?? "flat";
    fillColor = d.fillColor ?? seriesColor;
    if (d.radarAccessor) {
      final = computeRadarGeometry({
        values: d.data.map((item, i) => d.radarAccessor!(item, i)),
        items: d.data,
        cx: radar.cx,
        cy: radar.cy,
        R: radar.R,
        domainMax: radar.domainMax,
      });
    }
  }

  // Update-animation bookkeeping (same contract as the other series).
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

  const fillActive = fillOpacity > 0 && final !== null;

  // ── Canvas registration ───────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !final || hidden || !radar) return;
    const id = `series:${seriesId}`;
    const { cx, cy, R, domainMax, axisCount: n } = radar;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const isEntrance = prevRef.current === null;
      const p = animationsDisabled ? 1 : st.progress;
      const g = isEntrance
        ? entranceFrame(final, p, cx, cy, n)
        : frameRadarGeometry(final, prevRef.current, p);
      c.save();
      if (fillOpacity > 0 && g.fillPath) {
        if (fillStyle === "gradient") {
          const grad = c.createRadialGradient(cx, cy, 0, cx, cy, R);
          grad.addColorStop(0, hexWithAlpha(fillColor, 0));
          grad.addColorStop(1, hexWithAlpha(fillColor, fillOpacity * p));
          c.fillStyle = grad;
        } else {
          c.globalAlpha = fillOpacity * p;
          c.fillStyle = fillColor;
        }
        c.fill(new Path2D(g.fillPath));
        c.globalAlpha = 1;
      }
      c.strokeStyle = seriesColor;
      c.lineWidth = lineWidth;
      c.lineJoin = "round";
      if (lineDash) c.setLineDash(lineDash);
      if (g.linePath) c.stroke(new Path2D(g.linePath));
      c.setLineDash([]);
      if (showMarkers) {
        c.fillStyle = seriesColor;
        for (const pt of g.points) {
          c.beginPath();
          c.arc(pt.x, pt.y, markerSize, 0, Math.PI * 2);
          c.fill();
        }
      }
      if (goal !== null && !isEntrance) {
        const r = Math.max(0, Math.min(1, goal / domainMax)) * R;
        const a = radarAngle(0, n);
        const gx = cx + r * Math.cos(a);
        const gy = cy + r * Math.sin(a);
        c.fillStyle = seriesColor;
        c.beginPath();
        c.arc(gx, gy, 4, 0, Math.PI * 2);
        c.fill();
        if (goalLabel) {
          c.font = "600 11px sans-serif";
          c.textAlign = "left";
          c.textBaseline = "middle";
          c.fillText(goalLabel, gx + 10, gy + 18);
        }
      }
      // Hover: pop dot on this series' point at the hovered axis.
      const hoverItem = hover?.items.find((it) => it.seriesId === seriesId);
      if (hover && hoverItem) {
        c.fillStyle = seriesColor;
        c.lineWidth = 1.5;
        c.strokeStyle = theme.crosshairColor;
        c.beginPath();
        c.arc(hover.x, hoverItem.y, 3.5, 0, Math.PI * 2);
        c.fill();
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
    radar,
    seriesId,
    seriesColor,
    lineDash,
    lineWidth,
    showMarkers,
    markerSize,
    goal,
    goalLabel,
    fillOpacity,
    fillStyle,
    fillColor,
    hover,
    theme,
    animationsDisabled,
    registerDraw,
    unregisterDraw,
  ]);

  if (final === null) return null;

  // ── SVG render ────────────────────────────────────────────────────────────
  if (renderer !== "svg") return null;
  const p = animationsDisabled ? 1 : progress;
  const g = entrance
    ? entranceFrame(final, p, radar!.cx, radar!.cy, axisCount)
    : frameRadarGeometry(final, prev, p);
  const entranceP = entrance ? p : 1;
  const hoverItem = hover?.items.find((it) => it.seriesId === seriesId);

  // Goal marker geometry (first axis, 12 o'clock).
  let goalPx: { x: number; y: number } | null = null;
  if (goal !== null && radar) {
    const r = Math.max(0, Math.min(1, goal / radar.domainMax)) * radar.R;
    const a = radarAngle(0, axisCount);
    goalPx = { x: radar.cx + r * Math.cos(a), y: radar.cy + r * Math.sin(a) };
  }

  return (
    <g
      data-chart-series={seriesId}
      style={{
        opacity: hidden ? 0 : seriesDimStyle(hover, seriesId, hoverDim),
        transition: "opacity 250ms ease",
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      <defs>
        {fillActive && fillStyle === "gradient" && (
          <radialGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            cx={radar!.cx}
            cy={radar!.cy}
            r={radar!.R}
          >
            <stop
              offset="0"
              stopColor={fillColor}
              stopOpacity={0}
            />
            <stop
              offset="1"
              stopColor={fillColor}
              stopOpacity={fillOpacity * entranceP}
            />
          </radialGradient>
        )}
      </defs>
      {fillActive && g.fillPath && (
        <path
          d={g.fillPath}
          fill={fillStyle === "gradient" ? `url(#${gradId})` : fillColor}
          opacity={fillStyle === "flat" ? fillOpacity * entranceP : 1}
        />
      )}
      <path
        d={g.linePath}
        fill="none"
        stroke={seriesColor}
        strokeWidth={lineWidth}
        strokeDasharray={lineDash?.join(" ")}
        strokeLinejoin="round"
      />
      {showMarkers &&
        g.points.map((pt, i) => (
          <circle
            key={`m-${pt.axis}-${i}`}
            cx={pt.x}
            cy={pt.y}
            r={markerSize}
            fill={seriesColor}
          />
        ))}
      {goalPx && (
        <g pointerEvents="none">
          <circle cx={goalPx.x} cy={goalPx.y} r={4} fill={seriesColor} />
          {goalLabel && (
            <text
              x={goalPx.x + 10}
              y={goalPx.y + 18}
              fontSize={11}
              fontWeight={600}
              fill={seriesColor}
              dominantBaseline="middle"
            >
              {goalLabel}
            </text>
          )}
        </g>
      )}
      {hoverItem && (
        <circle
          cx={hover!.x}
          cy={hoverItem.y}
          r={3.5}
          fill={seriesColor}
          stroke={theme.crosshairColor}
          strokeWidth={1.5}
          pointerEvents="none"
        />
      )}
    </g>
  );
}
