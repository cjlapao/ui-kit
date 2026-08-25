/**
 * <Chart.DataLabels> — value badges on the series endpoints (the four
 * left-edge pills in the reference demo). HTML pills, positioned from
 * the root's seriesEndpoints (works for both renderers).
 */
import type { CSSProperties } from "react";
import { formatSI, shadeColor } from "../../engine/index";
import { useChart } from "../ChartContext";
import type { DataLabelsProps } from "../props";

const PILL_H = 18;

export function DataLabels(props: DataLabelsProps = {}) {
  const ctx = useChart();
  const { seriesEndpoints, series, area, width, piePresentations, height } = ctx;
  const position = props.position ?? "none";
  if (position === "none") return null;

  // Cartesian: endpoint badges. Pie/donut: one label per slice (slices
  // under 5% of the total are skipped — the reference leaves the smallest
  // slice unlabeled).
  const endpoints =
    position === "all" ? seriesEndpoints : seriesEndpoints; // v1: endpoints
  const pieSlices =
    position === "all"
      ? series.flatMap((s) => {
          if (s.descriptor.type !== "pie") return [];
          const pres = piePresentations.get(s.descriptor.id);
          if (!pres || s.hidden || pres.total <= 0) return [];
          const labelR =
            pres.innerRadius > 0
              ? (pres.innerRadius + pres.outerRadius) / 2
              : pres.outerRadius * 0.62;
          return pres.slices
            .filter((sl) => sl.value / pres.total >= 0.06)
            .map((sl) => ({
              key: `${s.descriptor.id}-${sl.name}-${sl.value}`,
              name: sl.name,
              color: sl.color,
              value: sl.value,
              x: pres.cx + labelR * Math.sin(sl.labelAngle),
              y: pres.cy - labelR * Math.cos(sl.labelAngle),
            }));
        })
      : [];

  if (endpoints.length === 0 && pieSlices.length === 0) return null;

  const labelStyle: CSSProperties = {
    position: "absolute",
    height: PILL_H,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    padding: "0 7px",
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {endpoints.map((ep) => {
        const text = props.formatter
          ? props.formatter(ep.value, ep.name)
          : formatSI(ep.value);
        const renderPoint = {
          seriesId: ep.id,
          seriesName: ep.name,
          color: ep.color,
          value: ep.value,
          x: ep.x,
          y: ep.y,
          isLast: true,
        };
        const w = text.length * 7 + 14;
        const bx =
          props.anchor === "margin-left"
            ? Math.max(2, area.x - w - 6)
            : Math.min(width - w - 2, ep.x + 10);
        const by = Math.max(2, Math.min(ep.y - PILL_H / 2, height - PILL_H - 2));

        if (props.render) {
          return (
            <div
              key={ep.id}
              style={{ position: "absolute", left: bx, top: by }}
            >
              {props.render(renderPoint)}
            </div>
          );
        }
        return (
          <div
            key={ep.id}
            style={{
              ...labelStyle,
              left: bx,
              top: by,
              width: w,
              background: ep.color,
              color: "#ffffff",
            }}
          >
            {text}
          </div>
        );
      })}
      {pieSlices.map((sl) => {
        const text = props.formatter
          ? props.formatter(sl.value, sl.name)
          : formatSI(sl.value);
        const w = text.length * 7 + 14;
        const bx = Math.max(2, Math.min(width - w - 2, sl.x - w / 2));
        const by = Math.max(2, Math.min(height - PILL_H - 2, sl.y - PILL_H / 2));
        if (props.render) {
          return (
            <div key={sl.key} style={{ position: "absolute", left: bx, top: by }}>
              {props.render({
                seriesId: sl.name,
                seriesName: sl.name,
                color: sl.color,
                value: sl.value,
                x: sl.x,
                y: sl.y,
                isLast: false,
              })}
            </div>
          );
        }
        return (
          <div
            key={sl.key}
            style={{
              ...labelStyle,
              left: bx,
              top: by,
              width: w,
              background: shadeColor(sl.color, 0.45),
              color: "#ffffff",
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}
