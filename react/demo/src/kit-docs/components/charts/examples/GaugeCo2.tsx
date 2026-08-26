import { Chart } from "@cjlapao/ui-kit";
import { gaugeCo2 } from "../data";

/**
 * Atmospheric CO₂ (Mauna Loa, 2024 annual mean). A ~300° donut gauge on the
 * 280–450 ppm scale; the gray track is the remaining headroom. The center
 * stacks value + unit + delta + baseline via PieCenter's render prop.
 */
export function GaugeCo2() {
  const { value, min, max, sub, delta, baseline } = gaugeCo2;
  return (
    <Chart.Svg height={380} ariaLabel="Atmospheric CO2 concentration">
      <Chart.Title
        title="Atmospheric CO₂ concentration — Mauna Loa"
        subtitle="Source: NOAA Global Monitoring Laboratory · 2024 annual mean · Pre-industrial baseline 280 ppm"
      />
      <Chart.Gauge
        value={value}
        min={min}
        max={max}
        arcSpan={(290 / 360) * Math.PI * 2}
        innerRadius={0.8}
        zones={[
          { from: 280, to: 380, color: "#10b981" },
          { from: 380, to: 420, color: "#fbbf24" },
          { from: 420, to: 450, color: "#ef4444" },
        ]}
      />
      <Chart.PieCenter
        render={({ total }) => (
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-rose-500">
              {total > 0 ? value.toFixed(1) : "—"}
            </span>
            <span className="text-xs text-neutral-400">{sub}</span>
            <span className="text-xs font-medium text-rose-400">{delta}</span>
            <span className="text-[10px] text-neutral-500">{baseline}</span>
          </div>
        )}
      />
    </Chart.Svg>
  );
}

export default GaugeCo2;
