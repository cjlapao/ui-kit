/**
 * <Chart.ReferenceLine> and <Chart.ReferenceBand> — crosshair-style
 * lines and shaded phase windows, with optional pill labels.
 */
import { useEffect } from "react";
import {
  resolveToneHex,
  formatFullDate,
} from "../../engine/index";
import type { ContinuousScale } from "../../engine/types";
import { useChart } from "../ChartContext";
import type { ReferenceBandProps, ReferenceLineProps } from "../props";

function xPixel(
  ctx: ReturnType<typeof useChart>,
  x: number | Date | string | undefined,
): number | null {
  if (x === undefined || !ctx.xScale) return null;
  if ("bandWidth" in ctx.xScale) {
    return ctx.xScale.center(String(x));
  }
  const cont = ctx.xScale as ContinuousScale;
  return cont.map(x as never);
}

function formatXLabel(
  ctx: ReturnType<typeof useChart>,
  x: number | Date | string | undefined,
): string {
  if (x === undefined) return "";
  if (ctx.xScale && ctx.xScale.type === "time") {
    const d = x instanceof Date ? x : new Date(x as number | string);
    return Number.isNaN(d.getTime()) ? String(x) : formatFullDate(d);
  }
  return String(x);
}

/** A two-point (sloped) line when both endpoints are given. */
function twoPoint(
  props: ReferenceLineProps,
  ctx: ReturnType<typeof useChart>,
): { x1: number; y1: number; x2: number; y2: number } | null {
  if (
    props.x === undefined ||
    props.y === undefined ||
    props.x2 === undefined ||
    props.y2 === undefined ||
    !ctx.xScale ||
    !ctx.yScale
  )
    return null;
  const px1 = xPixel(ctx, props.x);
  const px2 = xPixel(ctx, props.x2);
  const yCont =
    ctx.yScale && !("bandWidth" in ctx.yScale)
      ? (ctx.yScale as ContinuousScale)
      : null;
  if (!yCont) return null;
  const py1 = yCont.map(props.y);
  const py2 = yCont.map(props.y2);
  if (px1 === null || px2 === null) return null;
  return { x1: px1, y1: py1, x2: px2, y2: py2 };
}

export function ReferenceLine(props: ReferenceLineProps) {
  const ctx = useChart();
  const { renderer, area, theme, yScale } = ctx;
  const color = props.color ?? theme.crosshairColor;
  const dash = props.dash ?? [4, 4];
  const sloped =
    props.x !== undefined &&
    props.y !== undefined &&
    props.x2 !== undefined &&
    props.y2 !== undefined;

  useEffect(() => {
    if (renderer !== "canvas") return;
    const id = `feature:refline-${props.x ?? ""}-${props.y ?? ""}-${props.x2 ?? ""}-${props.y2 ?? ""}`;
    const fn = (c: CanvasRenderingContext2D) => {
      c.save();
      c.strokeStyle = color;
      c.lineWidth = 1;
      c.setLineDash(dash);
      c.beginPath();
      const seg = twoPoint(props, ctx);
      if (seg) {
        c.moveTo(seg.x1, seg.y1);
        c.lineTo(seg.x2, seg.y2);
      } else if (props.x !== undefined) {
        const px = xPixel(ctx, props.x);
        if (px !== null) {
          c.moveTo(px, area.y);
          c.lineTo(px, area.y + area.height);
        }
      } else if (props.y !== undefined && yScale && !("bandWidth" in yScale)) {
        const py = (yScale as ContinuousScale).map(props.y);
        c.moveTo(area.x, py);
        c.lineTo(area.x + area.width, py);
      }
      c.stroke();
      if (sloped && props.label) {
        const seg = twoPoint(props, ctx)!;
        c.fillStyle = theme.subtleText;
        c.font = "10.5px sans-serif";
        c.textAlign = "end";
        c.textBaseline = "bottom";
        c.fillText(props.label, seg.x2 - 4, seg.y2 - 3);
      } else if (!sloped && props.y !== undefined && yScale && !("bandWidth" in yScale)) {
        const py = (yScale as ContinuousScale).map(props.y);
        const atStart = props.labelPosition === "start";
        c.fillStyle = theme.subtleText;
        c.font = "10.5px sans-serif";
        c.textAlign = atStart ? "left" : "right";
        c.textBaseline = "bottom";
        c.fillText(
          props.label ?? "",
          atStart ? area.x + 4 : area.x + area.width - 4,
          py - 3,
        );
      }
      c.restore();
    };
    ctx.registerDraw(id, fn);
    return () => ctx.unregisterDraw(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, area, color, dash, props.x, props.y, props.x2, props.y2, props.label, props.labelPosition, ctx.registerDraw, ctx.unregisterDraw]);

  if (renderer !== "svg") return null;
  const seg = twoPoint(props, ctx);
  const px = xPixel(ctx, props.x);
  const py =
    props.y !== undefined && yScale && !("bandWidth" in yScale)
      ? (yScale as ContinuousScale).map(props.y)
      : null;
  const label = props.label ?? (props.x !== undefined ? formatXLabel(ctx, props.x) : undefined);

  return (
    <g data-chart-feature="refline" pointerEvents="none">
      {seg && (
        <line
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke={color}
          strokeWidth={1}
          strokeDasharray={dash.join(" ")}
        />
      )}
      {seg && props.label && (
        <text
          x={seg.x2 - 4}
          y={seg.y2 - 5}
          textAnchor="end"
          dominantBaseline="auto"
          fontSize={10.5}
          fill={theme.subtleText}
        >
          {props.label}
        </text>
      )}
      {!seg && px !== null && (
        <line
          x1={px}
          y1={area.y}
          x2={px}
          y2={area.y + area.height}
          stroke={color}
          strokeWidth={1}
          strokeDasharray={dash.join(" ")}
        />
      )}
      {!seg && py !== null && (
        <line
          x1={area.x}
          y1={py}
          x2={area.x + area.width}
          y2={py}
          stroke={color}
          strokeWidth={1}
          strokeDasharray={dash.join(" ")}
        />
      )}
      {!seg && label && px !== null && (
        <g>
          <rect
            x={px - (label.length * 6.6 + 16) / 2}
            y={area.y + area.height + 4}
            width={label.length * 6.6 + 16}
            height={18}
            rx={9}
            fill={theme.bandLabelBg}
          />
          <text
            x={px}
            y={area.y + area.height + 13}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10.5}
            fill={theme.titleText}
          >
            {label}
          </text>
        </g>
      )}
      {/* Horizontal line: plain label at the chosen end, above the rule. */}
      {!seg && label && py !== null && (
        <text
          x={
            props.labelPosition === "start"
              ? area.x + 4
              : area.x + area.width - 4
          }
          y={py - 5}
          textAnchor={props.labelPosition === "start" ? "start" : "end"}
          dominantBaseline="auto"
          fontSize={10.5}
          fill={theme.subtleText}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function ReferenceBand(props: ReferenceBandProps) {
  const ctx = useChart();
  const { renderer, area, theme, yScale } = ctx;
  const opacity = props.opacity ?? 0.1;
  const hex = props.color ? resolveToneHex(props.color, 0) : "#8b5cf6";

  const px1 = props.x1 !== undefined ? xPixel(ctx, props.x1) : null;
  const px2 = props.x2 !== undefined ? xPixel(ctx, props.x2) : null;
  const yCont =
    yScale && !("bandWidth" in yScale) ? (yScale as ContinuousScale) : null;
  const py1 =
    props.y1 !== undefined && yCont ? yCont.map(props.y1) : null;
  const py2 =
    props.y2 !== undefined && yCont ? yCont.map(props.y2) : null;

  let rect: { x: number; y: number; w: number; h: number } | null = null;
  if (px1 !== null && px2 !== null) {
    rect = {
      x: Math.min(px1, px2),
      y: area.y,
      w: Math.abs(px2 - px1),
      h: area.height,
    };
  } else if (py1 !== null && py2 !== null) {
    rect = {
      x: area.x,
      y: Math.min(py1, py2),
      w: area.width,
      h: Math.abs(py2 - py1),
    };
  }

  useEffect(() => {
    if (renderer !== "canvas" || !rect) return;
    const id = `feature:refband-${props.x1 ?? ""}-${props.y1 ?? ""}`;
    const fn = (c: CanvasRenderingContext2D) => {
      c.save();
      c.globalAlpha = opacity;
      c.fillStyle = hex;
      c.fillRect(rect!.x, rect!.y, rect!.w, rect!.h);
      c.restore();
    };
    ctx.registerDraw(id, fn, "back");
    return () => ctx.unregisterDraw(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, rect, opacity, hex, ctx.registerDraw, ctx.unregisterDraw]);

  if (renderer !== "svg" || !rect) return null;
  const labelW = props.label ? props.label.length * 6.6 + 16 : 0;

  return (
    <g data-chart-feature="refband" pointerEvents="none">
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.w}
        height={rect.h}
        fill={hex}
        opacity={opacity}
      />
      {props.label && (
        <g>
          <rect
            x={rect.x + rect.w / 2 - labelW / 2}
            y={rect.y + 4}
            width={labelW}
            height={18}
            rx={9}
            fill={theme.bandLabelBg}
          />
          <text
            x={rect.x + rect.w / 2}
            y={rect.y + 13}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10.5}
            fill={theme.titleText}
          >
            {props.label}
          </text>
        </g>
      )}
    </g>
  );
}
