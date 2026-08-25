/**
 * <Chart.PieCenter> — donut center readout (HTML overlay, works for both
 * renderers). Shows a default title/value/subtitle and updates to the
 * hovered slice's name/value/percent (the reference "ARR MIX / $1.25M"
 * pattern). Renders nothing when the chart has no pie.
 */
import { formatSI } from "../../engine/index";
import { useChart } from "../ChartContext";
import type { PieCenterProps } from "../props";

export function PieCenter(props: PieCenterProps = {}) {
  const ctx = useChart();
  const { piePresentations, hover, theme } = ctx;

  // First registered pie presentation (pie charts with a single pie).
  const pres = piePresentations.size > 0 ? [...piePresentations.values()][0] : null;
  if (!pres || pres.innerRadius <= 0) return null;

  // Hovered slice: the root's hover hit-test returns the slice's index.
  const hoverItem = hover?.items[0];
  const hoverSlice =
    hoverItem != null && hoverItem.index != null
      ? pres.slices[hoverItem.index]
      : undefined;
  const hovered = hoverSlice
    ? {
        name: hoverSlice.name,
        value: hoverSlice.value,
        color: hoverSlice.color,
        percent: pres.total > 0 ? (hoverSlice.value / pres.total) * 100 : 0,
      }
    : null;

  const fmt = props.valueFormatter ?? ((v: number) => formatSI(v));
  const body =
    props.render ??
    ((state: {
        hovered: {
          name: string;
          value: number;
          color: string;
          percent: number;
        } | null;
        total: number;
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
                : (props.value ?? fmt(state.total))}
          </div>
          <div style={{ fontSize: 11, color: theme.subtleText }}>
            {h
              ? props.hoverSubtitle
                ? props.hoverSubtitle(h)
                : `${Math.round(h.percent)}% of total`
              : (props.subtitle ?? "")}
          </div>
        </>
      );
    });

  const boxW = Math.max(80, pres.innerRadius * 1.7);

  return (
    <div
      style={{
        position: "absolute",
        left: pres.cx,
        top: pres.cy,
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
      {body({ hovered, total: pres.total })}
    </div>
  );
}
