/**
 * <Chart.Tooltip> — HTML card floating over the chart, driven by the
 * root's hover state (snapped category / pie slice).
 */
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { formatFullDate, formatSI } from "../../engine/index";
import type { HoverItem } from "../../engine/types";
import { useChart } from "../ChartContext";
import type { TooltipProps } from "../props";

export function Tooltip(props: TooltipProps = {}) {
  const ctx = useChart();
  const { hover, width, height, theme, tooltipMode, xIsTime } = ctx;

  const visibleItems = hover?.items.filter((i) => !i.hidden) ?? [];
  const hv = hover;
  const active = !!hv && visibleItems.length > 0;

  // "follow" mode: a single item — the one closest to the hover anchor.
  const items: HoverItem[] =
    tooltipMode === "follow"
      ? [
          visibleItems.reduce((best, it) =>
            Math.abs((it.y ?? 0) - (hv?.y ?? 0)) <
            Math.abs((best.y ?? 0) - (hv?.y ?? 0))
              ? it
              : best,
          ),
        ]
      : visibleItems;

  const rawX = hv?.rawX;
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

  // Position the card next to the POINTER (not the snapped data anchor):
  // flipping/clamping against estimated 190x68 constants left multi-hundred
  // pixel gaps on the right half and let tall `rows` cards run past the
  // bottom edge. Measure the rendered card instead.
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const anchorX = hv && active ? hv.pointerX ?? hv.x : 0;
  const anchorY = hv && active ? hv.pointerY ?? hv.y ?? 40 : 0;
  useLayoutEffect(() => {
    if (!active) {
      setPos(null);
      return;
    }
    const el = cardRef.current;
    // Real size when measurable; item-count estimate otherwise (jsdom,
    // or the very first paint before measurement exists).
    const estH = 46 + items.length * 22;
    const w = el ? el.offsetWidth || 190 : 190;
    const h = el ? el.offsetHeight || estH : estH;
    let left = anchorX + 14;
    if (left + w > width - 8) left = anchorX - w - 14;
    left = Math.max(8, Math.min(left, Math.max(8, width - w - 8)));
    let top = anchorY + 12;
    if (top + h > height - 8) top = anchorY - h - 12;
    top = Math.max(8, Math.min(top, Math.max(8, height - h - 8)));
    setPos((prev) =>
      prev && prev.left === left && prev.top === top ? prev : { left, top },
    );
  }, [active, anchorX, anchorY, width, height, items.length]);

  if (!active) return null;

  const cardStyle: CSSProperties = {
    position: "absolute",
    left: pos?.left ?? 8,
    top: pos?.top ?? 8,
    visibility: pos ? undefined : "hidden",
    width: "max-content",
    maxWidth: 190,
    background: theme.tooltipBg,
    border: `1px solid ${theme.tooltipBorder}`,
    borderRadius: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,.25)",
    padding: "8px 10px",
    pointerEvents: "none",
    zIndex: 10,
  };

  return (
    <div ref={cardRef} style={cardStyle} data-chart-feature="tooltip">
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
