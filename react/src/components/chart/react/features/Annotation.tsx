/**
 * <Chart.Annotation> — a marker dot, a dashed leader line and a small
 * callout card (title + toned value), like the reference demo's
 * "Usage pricing launched / $1.2M" markers.
 */
import { useEffect } from "react";
import {
  resolveToneHex,
} from "../../engine/index";
import type { ContinuousScale } from "../../engine/types";
import { useChart } from "../ChartContext";
import type { AnnotationProps } from "../props";

function xPixelOf(
  x: number | Date | string | undefined,
  xScale: ReturnType<typeof useChart>["xScale"],
): number | null {
  if (x === undefined || !xScale) return null;
  if ("bandWidth" in xScale) return xScale.center(String(x));
  const cont = xScale as ContinuousScale;
  return cont.map(x as never);
}

const PAD_X = 10;
const PAD_Y = 8;
const TITLE_H = 14;
const VALUE_H = 20;
const CARD_H = PAD_Y * 2 + TITLE_H + VALUE_H;

/**
 * Card placement: the requested side first, then collision fixes —
 * a card that would overlap the title/subtitle/legend strip (above the
 * plot area) flips to the bottom side, and the result is clamped into
 * the chart box.
 */
function resolveCard(
  px: number,
  py: number,
  cardW: number,
  placement: AnnotationProps["placement"],
  area: { x: number; y: number; width: number; height: number },
  width: number,
  height: number,
): { cardX: number; cardY: number } {
  const place = placement ?? "auto";
  let cardX = 0;
  let cardY = 0;
  if (place === "top") {
    cardX = px - cardW / 2;
    cardY = py - CARD_H - 14;
  } else if (place === "bottom") {
    cardX = px - cardW / 2;
    cardY = py + 14;
  } else if (place === "left") {
    cardX = px - cardW - 14;
    cardY = py - CARD_H / 2;
  } else if (place === "right") {
    cardX = px + 14;
    cardY = py - CARD_H / 2;
  } else {
    // auto: top-left, flip per edge
    cardX = px - cardW - 14;
    cardY = py - CARD_H - 12;
    if (cardX < area.x - 40) cardX = px + 14;
    if (cardY < 4) cardY = py + 14;
  }
  // Top collision: flip below the point if it fits the plot, else pin the
  // card to the plot's top edge — never into the chrome above it.
  const plotBottom = area.y + area.height;
  if (cardY < area.y) {
    const flipped = py + 14;
    cardY = flipped + CARD_H <= plotBottom ? flipped : area.y;
  } else if (cardY + CARD_H > plotBottom) {
    cardY = Math.max(area.y, plotBottom - CARD_H);
  }
  cardX = Math.max(2, Math.min(cardX, width - cardW - 2));
  cardY = Math.max(2, Math.min(cardY, height - CARD_H - 2));
  return { cardX, cardY };
}

export function Annotation(props: AnnotationProps) {
  const ctx = useChart();
  const { renderer, area, theme, yScale } = ctx;
  const tone = resolveToneHex(props.tone ?? "purple", 0);

  const px = xPixelOf(props.x, ctx.xScale);
  const py =
    props.y !== undefined && yScale ? yScale.map(props.y) : null;

  const cardW =
    PAD_X * 2 +
    Math.max(props.title?.length ?? 0, props.value?.length ?? 0) * 7.2;

  const { cardX, cardY } =
    px !== null && py !== null
      ? resolveCard(
          px,
          py,
          cardW,
          props.placement,
          area,
          ctx.width,
          ctx.height,
        )
      : { cardX: 0, cardY: 0 };

  useEffect(() => {
    if (renderer !== "canvas" || px === null || py === null) return;
    const id = `feature:annotation-${props.x ?? ""}-${props.y ?? ""}`;
    const fn = (c: CanvasRenderingContext2D) => {
      const { cardX: cx, cardY: cy } = resolveCard(
        px,
        py,
        cardW,
        props.placement,
        area,
        ctx.width,
        ctx.height,
      );

      c.save();
      if (props.leaderLine !== false) {
        c.strokeStyle = tone;
        c.lineWidth = 1;
        c.setLineDash([3, 3]);
        c.beginPath();
        // leader from the dot to the card's nearest corner
        const lx = cx > px ? cx : cx + cardW;
        const ly = cy + (py < cy + CARD_H / 2 ? CARD_H : 0);
        c.moveTo(px, py);
        c.lineTo(lx, ly);
        c.stroke();
        c.setLineDash([]);
      }
      // dot
      c.fillStyle = tone;
      c.beginPath();
      c.arc(px, py, 4, 0, Math.PI * 2);
      c.fill();
      // card
      c.fillStyle = theme.annotationBg;
      c.strokeStyle = theme.annotationBorder;
      c.lineWidth = 1;
      roundRect(c, cx, cy, cardW, CARD_H, 8);
      c.fill();
      c.stroke();
      if (props.title) {
        c.fillStyle = theme.subtleText;
        c.font = "11px sans-serif";
        c.textAlign = "left";
        c.textBaseline = "top";
        c.fillText(props.title, cx + PAD_X, cy + PAD_Y);
      }
      if (props.value) {
        c.fillStyle = tone;
        c.font = "600 14px sans-serif";
        c.fillText(props.value, cx + PAD_X, cy + PAD_Y + TITLE_H);
      }
      c.restore();
    };
    ctx.registerDraw(id, fn);
    return () => ctx.unregisterDraw(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    renderer,
    px,
    py,
    cardW,
    props,
    tone,
    theme,
    area,
    ctx.width,
    ctx.height,
    ctx.registerDraw,
    ctx.unregisterDraw,
  ]);

  if (renderer !== "svg" || px === null || py === null) return null;

  return (
    <g data-chart-feature="annotation" pointerEvents="none">
      {props.leaderLine !== false && (
        <line
          x1={px}
          y1={py}
          x2={cardX + (px < cardX ? 0 : cardW)}
          y2={cardY + (py < cardY ? CARD_H : 0)}
          stroke={tone}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      )}
      <circle cx={px} cy={py} r={4} fill={tone} />
      <rect
        x={cardX}
        y={cardY}
        width={cardW}
        height={CARD_H}
        rx={8}
        fill={theme.annotationBg}
        stroke={theme.annotationBorder}
        strokeWidth={1}
      />
      {props.title && (
        <text
          x={cardX + PAD_X}
          y={cardY + PAD_Y}
          fontSize={11}
          fill={theme.subtleText}
          dominantBaseline="hanging"
        >
          {props.title}
        </text>
      )}
      {props.value && (
        <text
          x={cardX + PAD_X}
          y={cardY + PAD_Y + TITLE_H}
          fontSize={14}
          fontWeight={600}
          fill={tone}
          dominantBaseline="hanging"
        >
          {props.value}
        </text>
      )}
    </g>
  );
}

function roundRect(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
