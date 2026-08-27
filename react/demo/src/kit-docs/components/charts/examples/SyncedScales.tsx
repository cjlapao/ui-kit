import { Chart } from "@cjlapao/ui-kit";
import { syncedMonthly } from "../data";

/**
 * Two scales, one axis — a °C line and a 0–10 UV bar sync by month
 * category while keeping fully independent y scales.
 */
export function SyncedScales() {
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
        <Chart.Svg sync height={250}>
          <Chart.Line
            data={syncedMonthly}
            categoryXField="month"
            valueYField="tempMax"
            name="Temp max (°C)"
            color="#f59e0b"
            curve="smooth"
          />
          <Chart.XAxis />
          <Chart.YAxis format={(v) => `${v}°`} />
          <Chart.Tooltip />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
        <Chart.Svg sync height={250}>
          <Chart.Bar
            data={syncedMonthly}
            categoryXField="month"
            valueYField="uv"
            name="UV index (0–10)"
            color="#8b5cf6"
          />
          <Chart.XAxis />
          
          <Chart.Tooltip />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
      </div>
    </Chart.Group>
  );
}

export default SyncedScales;
