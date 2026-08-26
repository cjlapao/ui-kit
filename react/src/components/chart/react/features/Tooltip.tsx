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

  const visibleItems = hover?.items.filter((i) => !i.hidden) ?? [];
  if (!hover || visibleItems.length === 0) return null;

  // "follow" mode: a single item — the one closest to the hover anchor.
  const items: HoverItem[] =
    tooltipMode === "follow"
      ? [
          visibleItems.reduce((best, it) =>
            Math.abs((it.y ?? 0) - (hover.y ?? 0)) <
            Math.abs((best.y ?? 0) - (hover.y ?? 0))
              ? it
              : best,
          ),
        ]
      : visibleItems;

  const rawX = hover.rawX;
  const header =
    rawX !== undefined
      ? props.headerFormat
        ? props.headerFormat(rawX)
        : xIsTime
          ? formatFullDate(
              typeof rawX === "string" ? new Date(rawX).getTime() : rawX,
            )
          : typeof rawX === "number"
            ? Number.isInteger(rawX)
              ? String(rawX)
              : String(Math.round(rawX * 100) / 100)
            : String(rawX)
      : ctx.title;

  const CARD_W = 190;
  let left = hover.x + 14;
  if (left + CARD_W > width - 8) left = hover.x - CARD_W - 14;
  if (left < 8) left = 8;
  // Vertical: follow the cursor's Y. If the card would run past the bottom
  // edge, flip above the cursor; clamp into the chart either way.
  const estH = 46 + items.length * 22;
  const py = hover.pointerY ?? hover.y ?? 40;
  let top = py + 12;
  if (top + estH > height - 8) top = py - estH - 12;
  top = Math.max(8, Math.min(top, height - estH - 8));

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
    <div style={cardStyle} data-chart-feature="tooltip">
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
          {items.map((it, i) =>
            props.rows ? (
              <div key={`${it.seriesId}-${i}`} style={{ padding: "2px 0", fontSize: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
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
                  <span style={{ color: theme.tooltipText, fontWeight: 600 }}>
                    {it.name ?? ""}
                  </span>
                </div>
                {props.rows(it).map((row, ri) => (
                  <div
                    key={ri}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "1px 0 1px 14px",
                    }}
                  >
                    <span style={{ color: theme.tooltipSubtleText }}>
                      {row.label}
                    </span>
                    <span
                      style={{
                        color: row.color ?? theme.tooltipText,
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
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
                    : it.valueMax !== undefined
                      ? `${formatSI(it.value)}–${formatSI(it.valueMax)}`
                      : formatSI(it.value)}
                </span>
              </div>
            ),
          )}
        </>
      )}
    </div>
  );
}
