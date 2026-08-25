import React from "react";
import { Chart, useChart } from "@cjlapao/ui-kit";
import {
  corridorCrest,
  corridorData,
  corridorForecast,
  corridorForecastZone,
  corridorRelease,
  corridorRiskZone,
  corridorSlo,
  corridorVolatility,
  type CorridorPoint,
} from "../data";

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });

/**
 * Four-row tooltip body: the two bands render min–max (the series' ranged
 * hover items) and volatility is a derived stat (envelope width as a share
 * of the average), computed from the hovered datum.
 */
function CorridorTooltipBody() {
  const { hover, theme } = useChart();
  if (!hover) return null;
  const datum = hover.items[0]?.item as CorridorPoint | undefined;
  const volatility = datum ? corridorVolatility(datum) : null;

  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "2px 0",
    fontSize: 12,
  };
  const rows: { name: string; color: string; text: string }[] = [
    ...hover.items.map((it) => ({
      name: it.name ?? "",
      color: it.color,
      text:
        it.valueMax !== undefined
          ? `${Math.round(it.value)}–${Math.round(it.valueMax)} ms`
          : `${Math.round(it.value)} ms`,
    })),
  ];
  if (volatility !== null) {
    rows.push({ name: "Volatility", color: "#ef4444", text: `${volatility}%` });
  }

  return (
    <>
      <div
        style={{
          color: theme.tooltipSubtleText,
          fontSize: 11,
          marginBottom: 6,
          whiteSpace: "nowrap",
        }}
      >
        {fmtTime(hover.rawX as Date)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={row}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: r.color,
              flex: "0 0 auto",
            }}
          />
          <span
            style={{
              color: theme.tooltipSubtleText,
              flex: "1 1 auto",
              whiteSpace: "nowrap",
            }}
          >
            {r.name}
          </span>
          <span
            style={{
              color: theme.tooltipText,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {r.text}
          </span>
        </div>
      ))}
    </>
  );
}

export default function RangeArea() {
  return (
    <Chart.Svg height={470}>
      <Chart.Title
        title="Checkout response corridor"
        subtitle="A min–max latency envelope tracks launch traffic, forecast drift, and the p95 guardrail in one continuous view."
      />
      <Chart.RangeArea
        data={corridorData}
        name="Full envelope"
        categoryXField="time"
        minYField="envMin"
        maxYField="envMax"
        color="#8b5cf6"
        curve="smooth"
        fillStyle="gradient"
        fillOpacity={0.45}
      />
      <Chart.RangeArea
        data={corridorData}
        name="Operating band"
        categoryXField="time"
        minYField="opMin"
        maxYField="opMax"
        color="#3b82f6"
        curve="smooth"
        fillStyle="gradient"
        fillOpacity={0.55}
      />
      <Chart.Line
        data={corridorData}
        name="Average response"
        categoryXField="time"
        valueYField="avg"
        color="#10b981"
        curve="smooth"
        lineStrokeWidth={2.5}
        showMarkers
        markerSize={2.5}
      />
      <Chart.XAxis
        tickCount={12}
        format={(t) => fmtTime(t as Date)}
      />
      <Chart.YAxis
        domain={[80, 310]}
        tickCount={6}
        format={(t) => `${t} ms`}
      />
      <Chart.ReferenceLine
        y={corridorSlo}
        color="#ef4444"
        dash={[5, 4]}
        label="p95 SLO"
        labelPosition="start"
      />
      <Chart.ReferenceBand
        x1={corridorRiskZone.from}
        x2={corridorRiskZone.to}
        color="#f59e0b"
        opacity={0.09}
        label="SLO risk zone"
      />
      <Chart.ReferenceBand
        x1={corridorForecastZone.from}
        x2={corridorForecastZone.to}
        color="#8b5cf6"
        opacity={0.07}
      />
      <Chart.Annotation
        x={corridorCrest.time}
        y={corridorCrest.value}
        tone="red"
        title="RISK CREST"
        value={`${corridorCrest.value} ms p95 band`}
        placement="top"
      />
      <Chart.Annotation
        x={corridorRelease.time}
        y={corridorRelease.avg}
        tone="emerald"
        title="Release train"
        leaderLine={false}
        placement="right"
      />
      <Chart.Annotation
        x={corridorForecast.time}
        y={corridorForecast.avg}
        tone="violet"
        title="Forecast"
        leaderLine={false}
        placement="right"
      />
      <Chart.DataLabels
        position="all"
        anchor="auto"
        formatter={(v, name) =>
          name === "Average response"
            ? `${Math.round(v)} ms now`
            : `${Math.round(v)} ms`
        }
      />
      <Chart.Legend />
      <Chart.Tooltip>
        <CorridorTooltipBody />
      </Chart.Tooltip>
      <Chart.Hover />
    </Chart.Svg>
  );
}
