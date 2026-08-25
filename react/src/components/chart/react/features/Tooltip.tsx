/**
 * <Chart.Tooltip> — HTML card floating over the chart, driven by the
 * root's hover state (snapped category / pie slice).
 */
import type { CSSProperties } from "react";
import { formatFullDate, formatSI } from "../../engine/index";
import type { HoverItem } from "../../engine/types";
import { useChart } from "../ChartContext";
import type { TooltipProps } from "../props";

export function Tooltip(props: TooltipProps = {}) {
  const ctx = useChart();
  const { hover, width, height, theme, tooltipMode, xIsTime } = ctx;

  if (!hover || hover.items.length === 0) return null;

  // "follow" mode: a single item — the one closest to the hover anchor.
  const items: HoverItem[] =
    tooltipMode === "follow"
      ? [
          hover.items.reduce((best, it) =>
            Math.abs((it.y ?? 0) - (hover.y ?? 0)) <
            Math.abs((best.y ?? 0) - (hover.y ?? 0))
              ? it
              : best,
          ),
        ]
      : hover.items;

  const rawX = hover.rawX;
  const header =
    rawX !== undefined
      ? props.headerFormat
        ? props.headerFormat(rawX)
        : xIsTime
          ? formatFullDate(
              typeof rawX === "string" ? new Date(rawX).getTime() : rawX,
            )
          : String(rawX)
      : ctx.title;

  const CARD_W = 190;
  let left = hover.x + 14;
  if (left + CARD_W > width - 8) left = hover.x - CARD_W - 14;
  if (left < 8) left = 8;
  const top = Math.max(
    8,
    Math.min((hover.y ?? 40) - 24, height - 90),
  );

  const cardStyle: CSSProperties = {
    position: "absolute",
    left,
    top,
    width: "max-content",
    maxWidth: CARD_W,
    background: theme.tooltipBg,
    border: `1px solid ${theme.tooltipBorder}`,
    borderRadius: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,.25)",
    padding: "8px 10px",
    pointerEvents: "none",
    zIndex: 10,
  };

  return (
    <div style={cardStyle}>
      {props.children ? (
        props.children
      ) : (
        <>
          {header !== undefined && (
            <div
              style={{
                color: theme.tooltipSubtleText,
                fontSize: 11,
                marginBottom: 6,
                whiteSpace: "nowrap",
              }}
            >
              {header}
            </div>
          )}
          {items.map((it, i) => (
            <div
              key={`${it.seriesId}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "2px 0",
                fontSize: 12,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: it.color,
                  flex: "0 0 auto",
                }}
              />
              <span style={{ color: theme.tooltipSubtleText, flex: "1 1 auto" }}>
                {it.name ?? ""}
              </span>
              <span
                style={{
                  color: theme.tooltipText,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {props.itemFormat
                  ? props.itemFormat(it.value, it.name ?? "")
                  : formatSI(it.value)}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
