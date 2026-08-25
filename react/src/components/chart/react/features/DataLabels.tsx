/**
 * <Chart.DataLabels> — value badges on the series endpoints (the four
 * left-edge pills in the reference demo). HTML pills, positioned from
 * the root's seriesEndpoints (works for both renderers).
 */
import { formatSI } from "../../engine/index";
import { useChart } from "../ChartContext";
import type { DataLabelsProps } from "../props";

const PILL_H = 18;

export function DataLabels(props: DataLabelsProps = {}) {
  const ctx = useChart();
  const { seriesEndpoints, area, width } = ctx;
  const position = props.position ?? "none";
  if (position === "none" || seriesEndpoints.length === 0) return null;

  const endpoints =
    position === "all" ? seriesEndpoints : seriesEndpoints; // v1: endpoints

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
        const by = Math.max(2, Math.min(ep.y - PILL_H / 2, ctx.height - PILL_H - 2));

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
              position: "absolute",
              left: bx,
              top: by,
              width: w,
              height: PILL_H,
              borderRadius: 999,
              background: ep.color,
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}
