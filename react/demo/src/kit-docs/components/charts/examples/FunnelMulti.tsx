import { Chart } from "@cjlapao/ui-kit";
import { funnelMarketing } from "../data";

const si = (v: number) =>
  v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : String(v);

/**
 * Multi-color funnel — a per-stage `colors` array (Impressions → Renewals),
 * conversion % between stages, stage names on dotted leaders. The small
 * tail stages hit the min-width clamp so their labels stay legible.
 */
export function FunnelMulti() {
  return (
    <Chart.Svg height={420} ariaLabel="Multi-color funnel">
      <Chart.Title
        title="Performance funnel"
        subtitle="Per-stage colors, conversion rates between stages, min-width clamp on the tail."
      />
      <Chart.Funnel
        data={funnelMarketing}
        name="Performance funnel"
        colors={["#7c5cf0", "#2f6fd0", "#12a5b8", "#0e9f6e", "#e0a520", "#e05252"]}
        valueFormat={si}
      />
      <Chart.Tooltip mode="shared" />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default FunnelMulti;
