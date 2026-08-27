import { Chart } from "@cjlapao/ui-kit";
import { syncedMonthly, syncedSolar } from "../data";

/**
 * Climate overview — the reference synced grid: temperature lines (°C),
 * rainfall bars (mm), a UV radar, and a solar heatmap, all sharing the
 * month categories. Hovering any card drives crosshair + tooltip on the
 * others at the same month. The heatmap keeps local hover (v1).
 */
export function SyncedClimate() {
  return (
    <Chart.Group>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: 16,
        }}
      >
        <Chart.Svg sync height={230}>
          <Chart.Line
            data={syncedMonthly}
            categoryXField="month"
            valueYField="tempMax"
            name="Max"
            color="#ffad5a"
            curve="smooth"
            showMarkers
            lineStrokeWidth={2}
          />
          <Chart.Line
            data={syncedMonthly}
            categoryXField="month"
            valueYField="tempMin"
            name="Min"
            color="#5daeea"
            curve="smooth"
            showMarkers
            lineStrokeWidth={2}
          />
          <Chart.XAxis />
          <Chart.YAxis format={(v) => `${v}°`} />
          <Chart.Tooltip mode="crosshair" />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
        <Chart.Svg sync height={230}>
          <Chart.Bar
            data={syncedMonthly}
            categoryXField="month"
            valueYField="rainfall"
            name="Rainfall"
            color="#36b7d6"
            cornerRadius={3}
          />
          <Chart.XAxis />
          <Chart.YAxis format={(v) => `${v}mm`} />
          <Chart.Tooltip mode="crosshair" />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
        <Chart.Svg sync height={270}>
          <Chart.Radar
            data={syncedMonthly}
            axisField="month"
            valueYField="uv"
            name="UV index"
            color="#c084fc"
            fillOpacity={0.2}
            showMarkers
          />
          <Chart.Tooltip />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
        <Chart.Svg sync height={270}>
          <Chart.Heatmap
            data={syncedSolar}
            categoryYField="month"
            categoryXField="hour"
            valueField="value"
            name="Solar W/m²"
            colorStops={["#fff7ed", "#fed7aa", "#ffad5a", "#ff7a66", "#b23b4b"]}
            legendTicks={3}
            valueLabels={false}
          />
          <Chart.Tooltip
            rows={(item) => {
              const t = item.item as {
                month?: string;
                hour?: string;
                value?: number;
              };
              if (!t) return [];
              return [
                { label: "Month", value: t.month ?? "" },
                { label: "Hour", value: t.hour ?? "" },
                {
                  label: "Solar",
                  value: `${t.value} W/m²`,
                  color: "#ffad5a",
                },
              ];
            }}
          />
          <Chart.Hover />
        </Chart.Svg>
      </div>
    </Chart.Group>
  );
}

export default SyncedClimate;
