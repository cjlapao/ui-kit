import { Chart } from "@cjlapao/ui-kit";
import { gaugeTemp } from "../data";

/**
 * Global temperature anomaly vs the 1951–1980 baseline. A 180° semicircle
 * with three discrete zones (safe / warming / critical) and a target marker
 * + label at the Paris Agreement 1.5°C line.
 */
export function GaugeTemperature() {
  const { value, min, max, target, targetLabel, sub } = gaugeTemp;
  return (
    <Chart.Svg height={320} ariaLabel="Global temperature anomaly">
      <Chart.Title
        title="Global temperature anomaly"
        subtitle="Source: NASA GISS Surface Temperature Analysis · January 2025 · Updated monthly"
      />
      <Chart.Gauge
        value={value}
        min={min}
        max={max}
        arcSpan={Math.PI}
        startAngle={Math.PI}
        innerRadius={0.62}
        zones={[
          { from: 0, to: 0.5, color: "#10b981" },
          { from: 0.5, to: 1, color: "#fbbf24" },
          { from: 1, to: 1.5, color: "#f87171" },
          { from: 1.5, to: 2, color: "#7f1d1d" },
        ]}
        target={target}
        targetLabel={targetLabel}
      />
      <Chart.PieCenter
        title={sub}
        value={`+${value}°C`}
      />
    </Chart.Svg>
  );
}

export default GaugeTemperature;
