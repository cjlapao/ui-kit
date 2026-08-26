import { Chart } from "@cjlapao/ui-kit";
import { comboDemand } from "../data";

/**
 * Electricity demand with the monthly mean temperature on a second axis —
 * the classic dual-axis combo: bars (TWh, left) + line (°C, right).
 */
export function ComboDualAxis() {
  return (
    <Chart.Svg height={440} ariaLabel="Electricity demand and mean temperature">
      <Chart.Title
        title="Electricity demand and mean temperature"
        subtitle="Bars: monthly demand in TWh · line: mean temperature in °C on the right axis"
      />
      <Chart.Bar
        data={comboDemand}
        name="Electricity demand"
        categoryXField="month"
        valueYField="demand"
        cornerRadius={3}
      />
      <Chart.Line
        data={comboDemand}
        name="Mean temperature"
        categoryXField="month"
        valueYField="temperature"
        yFieldAxis="right"
        color="orange"
        showMarkers
        lineStrokeWidth={2.5}
      />
      <Chart.XAxis />
      <Chart.YAxis
        label="Demand (TWh)"
        tickCount={7}
        format={(t) => `${t} TWh`}
      />
      <Chart.YAxis
        axis="right"
        label="Temperature (°C)"
        tickCount={7}
        format={(t) => `${t}°C`}
      />
      <Chart.Legend />
      <Chart.Tooltip
        itemFormat={(v, name) =>
          name === "Mean temperature" ? `${v}°C` : `${v} TWh`
        }
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboDualAxis;
