/**
 * <Chart.YAxis> — value axis (left by default, right for a second scale).
 * Horizontal gridlines, tick labels, the domain line, an optional title.
 */
import { useEffect } from "react";
import { formatSI } from "../../engine/index";
import { gridDashArray, gridLineDash, resolveGrid } from "../../engine/grid";
import { useChart } from "../ChartContext";
import type { YAxisProps } from "../props";

export function YAxis(props: YAxisProps = {}) {
  const ctx = useChart();
  const { renderer, yScale, rightYScale, area, theme } = ctx;
  const onRight = props.axis === "right";
  const scale = onRight ? rightYScale : yScale;

  const axesEnabled = ctx.axesEnabled;
  useEffect(() => {
    if (renderer !== "canvas" || !scale || !axesEnabled) return;
    const id = `feature:yaxis:${onRight ? "right" : "left"}`;
    const fn = (c: CanvasRenderingContext2D) => {
      if ("bandWidth" in scale) {
        // Transposed cartesian (horizontal waterfall): category labels,
        // no grid (gridlines come from the numeric x axis).
        const leftB = onRight ? area.x + area.width : area.x;
        if (props.axisLine !== false) {
          c.strokeStyle = theme.axisColor;
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(leftB, area.y);
          c.lineTo(leftB, area.y + area.height);
          c.stroke();
        }
        if (props.labels !== false) {
          c.fillStyle = theme.textColor;
          c.font = "11px sans-serif";
          c.textBaseline = "middle";
          c.textAlign = onRight ? "left" : "right";
          for (const cat of scale.domain) {
            c.fillText(
              cat,
              onRight ? leftB + 8 : leftB - 8,
              scale.center(cat),
            );
          }
        }
        return;
      }
      const ticks = scale.ticks(props.tickCount ?? 5);
      const format = props.format ?? ((t: number) => formatSI(t));
      const left = onRight ? area.x + area.width : area.x;
      if (props.grid !== false && !onRight) {
        const spec = resolveGrid(props, theme.gridColor);
        c.save();
        c.strokeStyle = spec.color;
        c.globalAlpha = spec.opacity;
        c.lineWidth = spec.width;
        c.setLineDash(gridLineDash(spec.style));
        for (const t of ticks) {
          const y = scale.map(t);
          c.beginPath();
          c.moveTo(area.x, y);
          c.lineTo(area.x + area.width, y);
          c.stroke();
        }
        c.restore();
      }
      if (props.axisLine !== false) {
        c.strokeStyle = theme.axisColor;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(left, area.y);
        c.lineTo(left, area.y + area.height);
        c.stroke();
      }
      if (props.labels !== false) {
        c.fillStyle = theme.textColor;
        c.font = "11px sans-serif";
        c.textBaseline = "middle";
        for (const t of ticks) {
          const y = scale.map(t);
          c.textAlign = onRight ? "left" : "right";
          c.fillText(format(Number(t)), onRight ? left + 8 : left - 8, y);
        }
      }
    };
    ctx.registerDraw(id, fn, "back");
    return () => ctx.unregisterDraw(id);
  }, [renderer, scale, onRight, area, theme, axesEnabled, ctx.registerDraw, ctx.unregisterDraw, props.tickCount, props.grid, props.gridDash, props.gridOpacity, props.labels, props.axisLine, props.format]);

  if (renderer !== "svg" || !scale || !axesEnabled) return null;
  const left = onRight ? area.x + area.width : area.x;

  // Transposed cartesian (horizontal waterfall): category labels on the y axis.
  if ("bandWidth" in scale) {
    return (
      <g data-chart-feature={`yaxis-${onRight ? "right" : "left"}`}>
        {props.axisLine !== false && (
          <line
            x1={left}
            y1={area.y}
            x2={left}
            y2={area.y + area.height}
            stroke={theme.axisColor}
            strokeWidth={1}
          />
        )}
        {props.labels !== false &&
          scale.domain.map((cat, i) => (
            <text
              key={i}
              x={onRight ? left + 8 : left - 8}
              y={scale.center(cat)}
              textAnchor={onRight ? "start" : "end"}
              dominantBaseline="middle"
              fontSize={11}
              fill={theme.textColor}
            >
              {cat}
            </text>
          ))}
      </g>
    );
  }

  const ticks = scale.ticks(props.tickCount ?? 5);
  const format = props.format ?? ((t: number) => formatSI(t));

  return (
    <g data-chart-feature={`yaxis-${onRight ? "right" : "left"}`}>
      {(() => {
        const spec = resolveGrid(props, theme.gridColor);
        return (
          <>
      {props.grid !== false && !onRight &&
        ticks.map((t, i) => (
          <line
            key={i}
            x1={area.x}
            y1={scale.map(t)}
            x2={area.x + area.width}
            y2={scale.map(t)}
            stroke={spec.color}
            strokeOpacity={spec.opacity}
            strokeDasharray={gridDashArray(spec.style)}
            strokeWidth={spec.width}
          />
        ))}
          </>
        );
      })()}
      {props.axisLine !== false && (
        <line
          x1={left}
          y1={area.y}
          x2={left}
          y2={area.y + area.height}
          stroke={theme.axisColor}
          strokeWidth={1}
        />
      )}
      {props.labels !== false &&
        ticks.map((t, i) => (
          <text
            key={i}
            x={onRight ? left + 8 : left - 8}
            y={scale.map(t)}
            textAnchor={onRight ? "start" : "end"}
            dominantBaseline="middle"
            fontSize={11}
            fill={theme.textColor}
          >
            {format(Number(t))}
          </text>
        ))}
      {props.label && (
        // 50px from the axis line: past the tick-label zone (8 + ~37px for
        // the widest "$1000k"-class labels) so the rotated title never
        // underlaps the tick values.
        <text
          x={onRight ? left + 50 : left - 50}
          y={area.y + area.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fill={theme.subtleText}
          transform={`rotate(${onRight ? 90 : -90} ${onRight ? left + 50 : left - 50} ${area.y + area.height / 2})`}
        >
          {props.label}
        </text>
      )}
    </g>
  );
}
