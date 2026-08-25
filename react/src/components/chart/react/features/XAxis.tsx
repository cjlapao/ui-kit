/**
 * <Chart.XAxis> — bottom axis: tick labels, optional vertical grid,
 * the domain line, and an optional axis title.
 *
 * The root auto-shows axes for cartesian charts; this component only
 * configures them (or appears on charts that otherwise have no axes).
 */
import { useEffect } from "react";
import { formatSI, timeTickFormat } from "../../engine/index";
import type { CategoricalScale, ContinuousScale } from "../../engine/types";
import { useChart } from "../ChartContext";
import type { XAxisProps } from "../props";

interface Tick {
  x: number;
  label: string;
}

function ticksFor(
  xScale: ContinuousScale | CategoricalScale,
  props: XAxisProps,
): Tick[] {
  if ("bandWidth" in xScale) {
    return xScale.domain.map((cat) => ({
      x: xScale.center(cat),
      label: cat,
    }));
  }
  const cont = xScale;
  const ticks = cont.ticks(props.tickCount);
  const format =
    props.format ??
    (cont.type === "time" ? timeTickFormat(cont) : (t: number | Date) =>
      formatSI(Number(t)));
  return ticks.map((t) => ({ x: cont.map(t), label: format(t) }));
}

/**
 * Pick a label anchor so edge ticks never clip: start at the left edge,
 * end at the right edge, middle elsewhere (label width ≈ 6.1px/char @11px).
 */
function edgeAnchor(
  label: string,
  x: number,
  left: number,
  right: number,
): "start" | "middle" | "end" {
  const half = (label.length * 6.1) / 2;
  if (x - half < left - 2) return "start";
  if (x + half > right + 2) return "end";
  return "middle";
}

export function XAxis(props: XAxisProps = {}) {
  const ctx = useChart();
  const { renderer, xScale, area, theme } = ctx;

  useEffect(() => {
    if (renderer !== "canvas" || !xScale) return;
    const id = "feature:xaxis";
    const fn = (c: CanvasRenderingContext2D) => {
      const ticks = ticksFor(xScale, props);
      const bottom = area.y + area.height;
      if (props.grid !== false && !("bandWidth" in xScale)) {
        c.save();
        c.globalAlpha = props.gridOpacity ?? 1;
        c.strokeStyle = theme.gridColor;
        c.lineWidth = 1;
        if (props.gridDash === "dashed") c.setLineDash([4, 4]);
        for (const t of ticks) {
          c.beginPath();
          c.moveTo(t.x, area.y);
          c.lineTo(t.x, bottom);
          c.stroke();
        }
        c.restore();
      }
      c.strokeStyle = theme.axisColor;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(area.x, bottom);
      c.lineTo(area.x + area.width, bottom);
      c.stroke();
      c.fillStyle = theme.textColor;
      c.font = "11px sans-serif";
      c.textBaseline = "top";
      const rightEdge = area.x + area.width;
      for (const t of ticks) {
        const a = edgeAnchor(t.label, t.x, area.x, rightEdge);
        c.textAlign = a === "middle" ? "center" : a;
        c.fillText(t.label, t.x, bottom + 8);
      }
      if (props.label) {
        c.textAlign = "center";
        c.fillText(
          props.label,
          area.x + area.width / 2,
          bottom + 24,
        );
      }
    };
    ctx.registerDraw(id, fn, "back");
    return () => ctx.unregisterDraw(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, xScale, area, theme, ctx.registerDraw, ctx.unregisterDraw, props.tickCount, props.grid, props.gridDash, props.gridOpacity, props.format, props.label]);

  if (renderer !== "svg" || !xScale) return null;
  const ticks = ticksFor(xScale, props);
  const bottom = area.y + area.height;
  const categorical = "bandWidth" in xScale;
  const rightEdge = area.x + area.width;

  return (
    <g data-chart-feature="xaxis">
      {props.grid !== false && !categorical &&
        ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x}
            y1={area.y}
            x2={t.x}
            y2={bottom}
            stroke={theme.gridColor}
            strokeWidth={1}
            strokeOpacity={props.gridOpacity ?? 1}
            strokeDasharray={props.gridDash === "dashed" ? "4 4" : undefined}
          />
        ))}
      <line
        x1={area.x}
        y1={bottom}
        x2={area.x + area.width}
        y2={bottom}
        stroke={theme.axisColor}
        strokeWidth={1}
      />
      {ticks.map((t, i) => (
        <text
          key={i}
          x={t.x}
          y={bottom + 8}
          textAnchor={edgeAnchor(t.label, t.x, area.x, rightEdge)}
          dominantBaseline="hanging"
          fontSize={11}
          fill={theme.textColor}
        >
          {t.label}
        </text>
      ))}
      {props.label && (
        <text
          x={area.x + area.width / 2}
          y={bottom + 24}
          textAnchor="middle"
          dominantBaseline="hanging"
          fontSize={11}
          fill={theme.subtleText}
        >
          {props.label}
        </text>
      )}
    </g>
  );
}
