import { useEffect, useState } from "react";
import { Chart } from "@cjlapao/ui-kit";

/**
 * A live SLO burn gauge: the value ticks up every 1.5 s (the arc morphs),
 * a dense tick rail, and a target dot at the 90 % freeze threshold.
 */
export function GaugeSloBurn() {
  const [value, setValue] = useState(98);

  useEffect(() => {
    const t = setInterval(() => {
      setValue((v) => {
        const next = v >= 99.6 ? 95.2 + Math.random() * 1.5 : v + 0.4;
        return Math.round(next * 10) / 10;
      });
    }, 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <Chart.Svg height={340} ariaLabel="Edge SLO burn guardrail">
      <Chart.Title
        title="Edge SLO burn guardrail"
        subtitle="Live burn updates every 1.5s. Threshold ticks show whether the next release can proceed."
      />
      <Chart.Gauge
        value={value}
        min={0}
        max={100}
        zones={[
          { from: 0, to: 70, color: "#10b981" },
          { from: 70, to: 88, color: "#f59e0b" },
          { from: 88, to: 100, color: "#ef4444" },
        ]}
        ticks={{ count: 40, majorEvery: 5, length: 9 }}
        target={90}
      />
      <Chart.PieCenter
        title="Burn rate"
        value={`${Math.round(value)}%`}
        subtitle={value >= 90 ? "Freeze deploys" : "Ship green"}
      />
    </Chart.Svg>
  );
}

export default GaugeSloBurn;
