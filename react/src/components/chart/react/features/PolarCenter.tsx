/**
 * <Chart.PolarCenter> — polar (rose) center readout (HTML overlay, both
 * renderers). Same body contract as <Chart.PieCenter>; renders nothing
 * when the chart has no polar series.
 */
import { formatSI } from "../../engine/index";
import { useChart } from "../ChartContext";
import type { PolarCenterProps } from "../props";

export function PolarCenter(props: PolarCenterProps = {}) {
  const ctx = useChart();
  const { polar, hover, theme } = ctx;
  if (!polar) return null;

  // Hovered row: the pointer-hit series (the root tags it with its real
  // seriesId; non-hit rows are prefixed), else the first row.
  const hit = hover?.items.find((i) => !i.seriesId.includes(":"));
  const hoverItem = hit ?? hover?.items[0];
  const hovered = hoverItem
    ? {
        name: hoverItem.name ?? String(hoverItem.index ?? ""),
        value: hoverItem.value,
        color: hoverItem.color,
      }
    : null;

  const fmt = props.valueFormatter ?? ((v: number) => formatSI(v));
  const body =
    props.render ??
    ((state: {
        hovered: { name: string; value: number; color: string } | null
      }) => {
      const h = state.hovered;
      return (
        <>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: theme.subtleText,
            }}
          >
            {h ? h.name : (props.title ?? "")}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.15,
              color: h ? h.color : theme.titleText,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {h
              ? fmt(h.value)
              : typeof props.value === "number"
                ? fmt(props.value)
                : (props.value ?? "")}
          </div>
          <div style={{ fontSize: 11, color: theme.subtleText }}>
            {props.subtitle ?? ""}
          </div>
        </>
      );
    });

  const hole = Math.max(polar.innerR, 0);
  const boxW = Math.max(80, (hole > 4 ? hole : polar.R * 0.55) * 1.7);

  return (
    <div
      style={{
        position: "absolute",
        left: polar.cx,
        top: polar.cy,
        width: boxW,
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        transition: "color 150ms ease",
      }}
    >
      {body({ hovered: hovered })}
    </div>
  );
}
