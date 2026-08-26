/**
 * <Chart.Legend> — HTML chips (works for both renderers) that toggle
 * series visibility through the root.
 */
import type { CSSProperties } from "react";
import { useChart } from "../ChartContext";
import type { LegendProps } from "../props";

interface Entry {
  id: string;
  name: string;
  color: string;
  hidden: boolean;
  swatch: "line" | "area" | "bar" | "circle" | "candle";
  dash?: number[] | null;
}

function swatchFor(sw: Entry["swatch"], color: string, dash?: number[] | null) {
  const dashStr = dash ? dash.join(" ") : undefined;
  switch (sw) {
    case "area":
      return (
        <svg width={16} height={10} aria-hidden>
          <rect x={1} y={2} width={14} height={6} rx={2} fill={color} opacity={0.5} />
          <line x1={1} y1={5} x2={15} y2={5} stroke={color} strokeWidth={1.5} />
        </svg>
      );
    case "line":
      return (
        <svg width={16} height={10} aria-hidden>
          <line
            x1={1}
            y1={5}
            x2={15}
            y2={5}
            stroke={color}
            strokeWidth={2}
            strokeDasharray={dashStr}
          />
          <circle cx={8} cy={5} r={2.2} fill={color} />
        </svg>
      );
    case "bar":
      return (
        <svg width={16} height={10} aria-hidden>
          <rect x={4} y={1} width={8} height={8} rx={1.5} fill={color} />
        </svg>
      );
    case "candle":
      return (
        <svg width={16} height={12} aria-hidden>
          <line x1={8} y1={0.5} x2={8} y2={11.5} stroke={color} strokeWidth={1} />
          <rect x={5} y={3} width={6} height={5} rx={1} fill={color} />
        </svg>
      );
    case "circle":
    default:
      return (
        <svg width={16} height={10} aria-hidden>
          <circle cx={8} cy={5} r={4} fill={color} />
        </svg>
      );
  }
}

export function Legend(props: LegendProps = {}) {
  const ctx = useChart();
  const { series, hiddenIds, toggleSeries, theme } = ctx;
  const vertical = props.orientation === "vertical";

  const entries: Entry[] = series.flatMap((s) => {
    const d = s.descriptor;
    let swatch: Entry["swatch"] = "line";
    let dash: number[] | null | undefined;
    if (d.type === "bar") swatch = "bar";
    else if (d.type === "polar") swatch = "bar";
    else if (d.type === "pie" || d.type === "scatter") swatch = "circle";
    else if (d.type === "candlestick") swatch = "candle";
    else if (d.fillOpacity) swatch = "area";
    else swatch = "line";
    dash = d.lineDash ?? null;
    // Pies list one entry per slice (name + slice color).
    if (d.type === "pie") {
      const pres = ctx.piePresentations.get(d.id);
      if (pres) {
        return pres.slices.map((slice) => ({
          id: d.id,
          name: slice.name,
          color: slice.color,
          hidden: hiddenIds.has(d.id),
          swatch: "circle" as const,
          dash: null,
        }));
      }
    }
    return [
      {
        id: d.id,
        name: d.name ?? d.id,
        color: s.color,
        hidden: hiddenIds.has(d.id),
        swatch,
        dash,
      },
    ];
  });

  const rowStyle: CSSProperties = vertical
    ? { display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }
    : { display: "flex", flexDirection: "row", gap: 14, alignItems: "center" };

  const content = entries.map((e) => {
    const chip = (
      <>
        {swatchFor(e.swatch, e.color, e.dash)}
        <span
          style={{
            color: e.hidden ? theme.subtleText : theme.textColor,
            fontSize: 12,
            lineHeight: 1,
            textDecoration: e.hidden ? "line-through" : "none",
          }}
        >
          {e.name}
        </span>
      </>
    );
    return (
      <button
        key={e.id}
        type="button"
        aria-pressed={!e.hidden}
        onClick={() => toggleSeries(e.id)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          border: "none",
          background: "transparent",
          padding: "2px 0",
          cursor: "pointer",
          opacity: e.hidden ? 0.55 : 1,
          fontFamily: "inherit",
        }}
      >
        {props.renderEntry
          ? props.renderEntry({
              id: e.id,
              name: e.name,
              color: e.color,
              hidden: e.hidden,
              swatch: e.swatch,
              dash: e.dash ?? undefined,
            })
          : chip}
      </button>
    );
  });

  return <div style={rowStyle}>{content}</div>;
}
