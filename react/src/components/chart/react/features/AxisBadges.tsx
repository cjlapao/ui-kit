/**
 * <Chart.AxisBadges> — value pills pinned to the y-axis. While the pointer
 * is over the plot, each visible series shows its value at the hovered
 * crosshair position (the reference's "values on the y-axis instead of the
 * tooltip" pattern); with `mode="endpoints"` or `"both"` the last values are
 * shown when idle.
 */
import type { CSSProperties } from "react";
import { useChart } from "../ChartContext";
import type { AxisBadgesProps } from "../props";

export function AxisBadges(props: AxisBadgesProps = {}) {
  const ctx = useChart();
  const {
    hover,
    series,
    area,
    xScale,
    yScale,
    rightYScale,
    seriesEndpoints,
  } = ctx;
  if (!xScale || !yScale) return null;

  const mode = props.mode ?? "hover";
  const hovering = hover !== null && hover.items.length > 0;
  if (mode === "hover" && !hovering) return null;
  if (!hovering && mode !== "endpoints" && mode !== "both") return null;

  const fmt = (v: number) => String(Math.round(v * 10) / 10);

  const pills: {
    key: string;
    color: string;
    text: string;
    y: number;
    rightAxis: boolean;
  }[] = [];
  for (const s of series) {
    if (s.hidden) continue;
    const d = s.descriptor;
    if (d.type === "pie") continue;
    const rightAxis = d.yFieldAxis === "right";
    const vs = rightAxis && rightYScale ? rightYScale : yScale;
    if (!vs) continue;
    // Hovered value for this series (or endpoint value when idle).
    const item = hovering
      ? hover.items.find((it) => it.seriesId === d.id)
      : undefined;
    const end = seriesEndpoints.find((e) => e.id === d.id);
    if (item) {
      pills.push({
        key: d.id,
        color: s.color,
        text: fmt(item.value),
        y: item.y,
        rightAxis,
      });
    } else if (mode !== "hover" && end) {
      pills.push({
        key: d.id,
        color: end.color,
        text: fmt(end.value),
        y: end.y,
        rightAxis,
      });
    }
  }
  if (pills.length === 0) return null;

  return (
    <div
      data-chart-feature="axis-badges"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}
    >
      {pills.map((p) => {
        const style: CSSProperties = {
          position: "absolute",
          left: p.rightAxis ? area.x + area.width + 6 : area.x - 6,
          top: p.y,
          transform: p.rightAxis
            ? "translateY(-50%)"
            : "translate(-100%, -50%)",
          background: p.color,
          color: "#fff",
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1,
          padding: "3px 8px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          boxShadow: "0 1px 4px rgba(0,0,0,.25)",
        };
        return (
          <div key={p.key} style={style}>
            {p.text}
          </div>
        );
      })}
    </div>
  );
}
