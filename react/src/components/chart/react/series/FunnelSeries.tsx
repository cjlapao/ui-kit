/**
 * <Chart.Funnel> — self-contained conversion funnel (no cartesian scales).
 *
 * Up to 6 stages; bright trapezoids with darker auto-derived connectors
 * and a bottom arrow. Stage values inside, conversion % in the gaps,
 * stage names on dotted leaders to the right.
 */
import { useEffect, useMemo } from "react";
import {
  computeFunnelGeometry,
  DEFAULT_SERIES_PALETTE,
  FUNNEL_MAX_STAGES,
  formatSI,
} from "../../engine/index";
import { useChart } from "../ChartContext";
import { seriesDimStyle } from "../series-common";
import type { FunnelSeriesProps } from "../props";

export function FunnelSeries(props: FunnelSeriesProps<unknown>) {
  const ctx = useChart();
  const {
    renderer,
    area,
    progress,
    registerDraw,
    unregisterDraw,
    hover,
    hoverDim,
    animationsDisabled,
    isDark,
    series,
  } = ctx;

  const me =
    series.find(
      (s) =>
        s.descriptor.type === "funnel" &&
        (props.id === undefined || s.descriptor.id === props.id),
    ) ?? null;
  const seriesId = me?.descriptor.id ?? "funnel";
  const d = me?.descriptor;

  const model = useMemo(() => {
    if (!me || !d?.funnelItems?.length) return null;
    const base =
      d.funnelColor ??
      DEFAULT_SERIES_PALETTE[d.paletteIndex % DEFAULT_SERIES_PALETTE.length];
    const colors = d.funnelColors?.length
      ? d.funnelColors
      : Array(FUNNEL_MAX_STAGES).fill(base);
    return computeFunnelGeometry(
      area,
      d.funnelItems.slice(0, FUNNEL_MAX_STAGES),
      {
        colors,
        showLabels: d.funnelShowLabels,
        showConversion: d.funnelShowConversion,
        arrow: d.funnelArrow,
        minWidthRatio: d.funnelMinWidthRatio,
        scale: d.funnelScale ?? "log",
      },
    );
  }, [me, d, area]);

  const hidden = me?.hidden ?? false;
  const dim = seriesDimStyle(hover, seriesId, hoverDim);
  const groupOpacity = hidden ? 0 : dim;

  const valueFmt = d?.funnelValueFormat ?? formatSI;
  const settled = progress >= 1 || animationsDisabled;
  const p = settled ? 1 : progress;

  // Hovered stage (root hit-tests; match by series + index).
  const hoverIdx = useMemo(() => {
    if (!hover) return -1;
    const it = hover.items.find((i) => i.seriesId === seriesId);
    return it && it.index !== undefined ? it.index : -1;
  }, [hover, seriesId]);

  // ── Canvas ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (renderer !== "canvas" || !model) return;
    const id = `feature:funnel:${seriesId}`;
    const fn = (c: CanvasRenderingContext2D, st: { progress: number }) => {
      const pp = animationsDisabled ? 1 : st.progress;
      const rise = (1 - pp) * 10;
      c.save();
      c.globalAlpha = groupOpacity * pp;
      c.translate(0, rise);
      const poly = (pts: [number, number][], fill: string) => {
        c.beginPath();
        pts.forEach(([x, y], i) => (i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)));
        c.closePath();
        c.fillStyle = fill;
        c.fill();
      };
      for (const cn of model.connectors) poly(cn.points, cn.color);
      if (model.arrow) poly(model.arrow.points, model.arrow.color);
      for (const stg of model.stages) {
        poly(stg.points, stg.color);
        if (stg.index === hoverIdx) {
          c.strokeStyle = isDark ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.9)";
          c.lineWidth = 1.5;
          c.stroke();
        }
      }
      if (d?.funnelShowValues !== false) {
        c.fillStyle = "#fff";
        c.font = "600 13px ui-sans-serif, system-ui, sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        for (const stg of model.stages) {
          c.fillText(valueFmt(stg.value), stg.valueX, stg.valueY);
        }
      }
      if (d?.funnelShowConversion !== false) {
        c.fillStyle = isDark ? "rgba(148,163,184,0.9)" : "rgba(100,116,139,0.95)";
        c.font = "11px ui-sans-serif, system-ui, sans-serif";
        c.textAlign = "left";
        c.textBaseline = "middle";
        for (const cn of model.connectors) {
          c.fillText(
            `${(cn.conversion * 100).toFixed(1)}%`,
            cn.labelX,
            cn.labelY,
          );
        }
      }
      if (d?.funnelShowLabels !== false) {
        c.font = "12px ui-sans-serif, system-ui, sans-serif";
        c.textAlign = "start";
        c.textBaseline = "middle";
        for (const stg of model.stages) {
          const midY = stg.valueY;
          const x1 = stg.cx + stg.width / 2 + 5;
          const x2 = model.labelX - 14;
          c.strokeStyle = stg.color;
          c.globalAlpha = groupOpacity * pp * 0.8;
          c.lineWidth = 1;
          c.setLineDash([2, 3]);
          c.beginPath();
          c.moveTo(x1, midY);
          c.lineTo(x2, midY);
          c.stroke();
          c.setLineDash([]);
          c.globalAlpha = groupOpacity * pp;
          c.fillStyle = stg.color;
          c.beginPath();
          c.arc(model.labelX - 8, midY, 2.5, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = isDark ? "#cbd5e1" : "#334155";
          c.fillText(stg.label, model.labelX, midY);
        }
      }
      c.restore();
    };
    registerDraw(id, fn, "front");
    return () => unregisterDraw(id);
  }, [
    renderer,
    model,
    groupOpacity,
    hoverIdx,
    isDark,
    animationsDisabled,
    valueFmt,
    d?.funnelShowValues,
    d?.funnelShowConversion,
    d?.funnelShowLabels,
    ctx.registerDraw,
    ctx.unregisterDraw,
  ]);

  if (renderer !== "svg" || !model || !d) return null;
  const showValues = d.funnelShowValues !== false;
  const showConversion = d.funnelShowConversion !== false;
  const showLabels = d.funnelShowLabels !== false;
  const rise = (1 - p) * 10;

  return (
    <g
      data-chart-series={seriesId}
      style={{ opacity: groupOpacity * p }}
      transform={`translate(0 ${rise})`}
    >
      {model.connectors.map((cn) => (
        <polygon
          key={`c${cn.index}`}
          points={cn.points.map(([x, y]) => `${x},${y}`).join(" ")}
          fill={cn.color}
        />
      ))}
      {model.arrow && (
        <polygon
          points={model.arrow.points.map(([x, y]) => `${x},${y}`).join(" ")}
          fill={model.arrow.color}
        />
      )}
      {model.stages.map((stg) => (
        <polygon
          key={stg.index}
          points={stg.points.map(([x, y]) => `${x},${y}`).join(" ")}
          fill={stg.color}
          stroke={
            stg.index === hoverIdx
              ? isDark
                ? "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0.9)"
              : undefined
          }
          strokeWidth={stg.index === hoverIdx ? 1.5 : 0}
        />
      ))}
      {showValues &&
        model.stages.map((stg) => (
          <text
            key={`v${stg.index}`}
            x={stg.valueX}
            y={stg.valueY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={13}
            fontWeight={600}
            fill="#fff"
            pointerEvents="none"
          >
            {valueFmt(stg.value)}
          </text>
        ))}
      {showConversion &&
        model.connectors.map((cn) => (
          <text
            key={`p${cn.index}`}
            x={cn.labelX}
            y={cn.labelY}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize={11}
            fill={isDark ? "rgba(148,163,184,0.9)" : "rgba(100,116,139,0.95)"}
            pointerEvents="none"
          >
            {(cn.conversion * 100).toFixed(1)}%
          </text>
        ))}
      {showLabels &&
        model.stages.map((stg) => {
          const midY = stg.valueY;
          const x1 = stg.cx + stg.width / 2 + 5;
          const x2 = model!.labelX - 14;
          return (
            <g key={`l${stg.index}`} pointerEvents="none">
              <line
                x1={x1}
                y1={midY}
                x2={x2}
                y2={midY}
                stroke={stg.color}
                strokeWidth={1}
                strokeDasharray="2 3"
                strokeOpacity={0.8}
              />
              <circle cx={model!.labelX - 8} cy={midY} r={2.5} fill={stg.color} />
              <text
                x={model!.labelX}
                y={midY}
                textAnchor="start"
                dominantBaseline="middle"
                fontSize={12}
                fill={isDark ? "#cbd5e1" : "#334155"}
              >
                {stg.label}
              </text>
            </g>
          );
        })}
    </g>
  );
}

export default FunnelSeries;
